import User from "../models/user.model.js"

// @desc Recuperer la liste de tous les utilisateurs
// @route GET /api/users
// @acces Prive (admin-only)
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password')
        res.status(200).json({ success: true, data: users })

    } catch (error) {
      next(error)
    }
}


// @desc Recuperer les infos d'un utilisateur
// @route GET /api/users/:id
// @acces Prive
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password')

        if(!user){
            const error = new Error('User not found')
            error.statusCode = 404
            throw error
        }
        res.status(200).json({ success: true, data: user })
    } catch (error) {
      next(error)
    }
}

// @desc Modifier un utilisateur
// @route PUT /api/users/:id
// @acces Prive (user-only)
export const updateUserProfile = async (req, res, next) => {
    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findById(req.params.id)
        if(!user){
            const error = new Error('User not found')
            error.statusCode = 404
            throw error
        }

        // Vérifier si l'utilisateur connecté est bien le propriétaire du profil ou un admin
        // Note: req.user._id (vient du token JWT via le middleware authorize)
        // user._id (vient de la recherche findById)
        if(req.user._id.toString() !== user._id.toString() && req.user.role !== "admin"){
            const error = new Error('Not authorized to update this profile')
            error.statusCode = 403
            throw error
        }

        // Mettre à jour les champs autorisés
        const { fullname, email, password } = req.body // Utiliser fullname
        if(fullname) user.fullname = fullname // Mettre à jour fullname
        if(email) user.email = email
        
        // Gérer la mise à jour du mot de passe de manière sécurisée
        // Cela suppose que ton user.model.js a un hook pre('save') pour hacher le mot de passe
        if (password) {
            user.password = password; // Le hook pre-save dans le modèle se chargera du hachage
        }

        const updatedUser = await user.save()
        
        // Retourner l'utilisateur mis à jour sans le mot de passe
        // .select('-password') sur la requête initiale ne suffit pas si le mot de passe est modifié et sauvegardé.
        // Il est préférable de reconstruire l'objet de réponse ou d'utiliser .toObject() et de supprimer manuellement.
        const userResponse = updatedUser.toObject();
        delete userResponse.password;
        
        res.status(200).json({ 
            success: true, 
            message: 'User updated successfully',
            data: userResponse
        })

    } catch (error) {
        next(error)
    }
}

// @desc Supprimer un utilisateur
// @route DELETE /api/users/:id
// @acces Prive (admin-only)
export const deleteUserProfile = async (req, res, next) => {
    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findById(req.params.id)
        if(!user){
            const error = new Error('User not found')
            error.statusCode = 404
            throw error
        }

        // Vérifier si l'utilisateur connecté est un admin
        if(req.user.role !== "admin"){
            const error = new Error('Not authorized - Admin only')
            error.statusCode = 403
            throw error
        }

        await User.findByIdAndDelete(req.params.id)
        
        res.status(200).json({ 
            success: true, 
            message: 'User deleted successfully'
        })

    } catch (error) {
        next(error)
    }
}