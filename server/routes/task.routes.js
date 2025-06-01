import { Router } from 'express'

const taskRouter = Router()

taskRouter.get('/', (req, res) => res.send( { titre: 'Recuperer tous les taches'}))

taskRouter.get('/:id', (req, res) => res.send( { titre: 'Recuperer un tache'}))

taskRouter.get('/user/:id', (req, res) => res.send( { titre: "Recuperer toutes les taches d'utilisateur"}))

taskRouter.post('/', (req, res) => res.send( { titre: 'Creer une tache'}))

taskRouter.put('/:id', (req, res) => res.send( { titre: 'Modifier une tache'}))

taskRouter.delete('/:id', (req, res) => res.send( { titre: 'Supprimer une tache'}))


export default taskRouter