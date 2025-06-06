import Task from "../models/task.model.js"

// @desc Recuperer toutes les taches
// @route GET /api/tasks
// @acces Prive (admin-only)
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({}).populate('utilisateur', 'fullname email')
        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}


// @desc Recuperer une tache par ID
// @route GET /api/tasks/:id
// @acces Prive (propriétaire de la tâche)
const getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id).populate('utilisateur', 'fullname email')

        if (!task) {
            const error = new Error('Tâche non trouvée.')
            error.statusCode = 404
            return next(error)
        }

        // Vérifier si l'utilisateur connecté est le propriétaire ou un admin
        if (task.utilisateur._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            const error = new Error('Accès non autorisé à cette tâche.')
            error.statusCode = 403
            return next(error)
        }

        res.status(200).json({
            success: true,
            data: task,
        })
    } catch (error) {
        next(error)
    }
}

// @desc Recuperer toutes les taches d'un utilisateur
// @route GET /api/tasks/:id
// @acces Prive (user-only)
const getUserTasks = async (req, res, next) => {
    try {
        const { statut, priorité, dateEcheance, sortByPriorité, sortByStatut } = req.query
        const query = { utilisateur: req.user._id }

        if (statut) {
            query.statut = statut
        }
        if (priorité) {
            query.priorité = priorité
        }
        if (dateEcheance) {
            query.dateEcheance = new Date(dateEcheance)
        }

        let sortOptions = {}
        if (sortByPriorité) {

            sortOptions.priorité = sortByPriorité === 'desc' ? -1 : 1
        }
        if (sortByStatut) {
            sortOptions.statut = sortByStatut === 'desc' ? -1 : 1;
        }

        const tasks = await Task.find(query).sort(sortOptions)

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
        })
    } catch (error) {
        next(error)
    }
}


// @desc Creer une tache
// @route POST /api/tasks
// @acces Prive (user-only)
const createTask = async (req, res, next) => {
    try {
        const { titre, description, dateEcheance, priorité, statut } = req.body

        if (!titre || !dateEcheance) {
            const error = new Error('Le titre et la date d\'échéance sont requis.')
            error.statusCode = 400
            return next(error)
        }

        const task = await Task.create({
            titre,
            description,
            dateEcheance,
            priorité,
            statut,
            utilisateur: req.user._id, // ID de l'utilisateur connecté
        })

        res.status(201).json({
            success: true,
            data: task,
        })
    } catch (error) {
        // Les erreurs de validation Mongoose seront également interceptées ici
        next(error)
    }
}

// @desc Mettre a jour une tache
// @route PUR /api/tasks/:id
// @acces Prive (propriétaire de la tâche)
const updateTask = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id)

        if (!task) {
            const error = new Error('Tâche non trouvée.')
            error.statusCode = 404
            return next(error)
        }

        // Vérifier si l'utilisateur connecté est le propriétaire de la tâche
        if (task.utilisateur.toString() !== req.user._id.toString()) {
            const error = new Error('Accès non autorisé : vous ne pouvez modifier que vos propres tâches.')
            error.statusCode = 403
            return next(error)
        }

        // Mettre à jour les champs fournis
        const { titre, description, dateEcheance, priorité, statut } = req.body
        if (titre) task.titre = titre
        if (description) task.description = description
        if (dateEcheance) task.dateEcheance = dateEcheance
        if (priorité) task.priorité = priorité
        if (statut) task.statut = statut

        const updatedTask = await task.save()

        res.status(200).json({
            success: true,
            data: updatedTask,
        })
    } catch (error) {
        next(error)
    }
}

// @desc Supprimer une tache
// @route DELETE /api/tasks/:id
// @acces Prive (propriétaire de la tâche)
const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id)

        if (!task) {
            const error = new Error('Tâche non trouvée.')
            error.statusCode = 404
            return next(error)
        }

        // Vérifier si l'utilisateur connecté est le propriétaire de la tâche
        if (task.utilisateur.toString() !== req.user._id.toString()) {
            const error = new Error('Accès non autorisé : vous ne pouvez supprimer que vos propres tâches.')
            error.statusCode = 403
            return next(error)
        }

        await task.deleteOne() // Utiliser deleteOne() sur l'instance du document

        res.status(200).json({
            success: true,
            message: 'Tâche supprimée avec succès.',
        })
    } catch (error) {
        next(error)
    }
}

export { getTasks, getTaskById, getUserTasks, createTask, updateTask, deleteTask }