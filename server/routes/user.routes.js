import { Router } from 'express'

const userRouter = Router()

userRouter.get('/', (req, res) => res.send( { titre: 'Recuperer tous les utilisateurs'}))

userRouter.get('/:id', (req, res) => res.send( { titre: 'Recuperer un utilisateurs'}))

userRouter.post('/', (req, res) => res.send( { titre: 'Creer un utilisateur'}))

userRouter.put('/:id', (req, res) => res.send( { titre: 'Modifier un utilisateur'}))

userRouter.delete('/:id', (req, res) => res.send( { titre: 'Supprimer un utilisateur'}))


export default userRouter