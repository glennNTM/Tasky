import { Router } from 'express'
import { getUser, getUsers } from '../controllers/user.controller.js'
import authorize from '../middlewares/auth.middleware.js'

const userRouter = Router()

userRouter.get('/', getUsers)

userRouter.get('/:id', authorize, getUser)

userRouter.put('/:id', (req, res) => res.send( { titre: 'Modifier un utilisateur'}))

userRouter.delete('/:id', (req, res) => res.send( { titre: 'Supprimer un utilisateur'}))


export default userRouter