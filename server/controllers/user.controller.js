import User from "../models/user.model.js"

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find()
        res.status(200).json({ success: true, data: users })

    } catch (error) {
      next(error)
    }
}


// @desc Deconnexion d'un utilisateur
// @route POST /api/auth/signout
// @acces Prive
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password')
        res.status(200).json({ success: true, data: user })

        if(!user){
            const error = new Error('User not found')
            error.statusCode = 404
            throw error
        }
    } catch (error) {
      next(error)
    }
}

// @desc Modifier un utilisateur
// @route PUT /api/auth/signout
// @acces Prive
export const updateUserProfile = async (req, res, next) => {

}

// @desc Supprimer un utilisateur
// @route DELETE /api/auth/signout
// @acces Prive
export const deleteUserProfile = async (req, res, next) => {

}