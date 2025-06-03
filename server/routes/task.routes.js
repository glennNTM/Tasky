import { Router } from 'express'
import { authorize, adminOnly } from '../middlewares/auth.middleware.js'
import { createTask, getTaskById, getTasks, getUserTasks, updateTask, deleteTask } from '../controllers/task.controller.js'

const taskRouter = Router()

taskRouter.get('/', authorize, adminOnly, getTasks) // Recuperer toutes les taches

taskRouter.get('/mytasks', authorize, getUserTasks) //  Recuperer les tâches de l'utilisateur connecté

taskRouter.get('/:id',  authorize, getTaskById) // Recuperer le details d'une tache d'un utilisateur

taskRouter.post('/', authorize, createTask) // Creer une tache - Ajout du middleware authorize

taskRouter.put('/:id', authorize, updateTask) // Modifier une tache

taskRouter.delete('/:id', authorize, deleteTask) // Supprimer une tache


export default taskRouter