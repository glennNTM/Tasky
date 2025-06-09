import { Router } from 'express'
import { deleteUserProfile, getUserProfile, getUsers, updateUserProfile, createUser } from '../controllers/user.controller.js'
import { authorize, adminOnly } from '../middlewares/auth.middleware.js'

const userRouter = Router()

// @acces Prive (admin-only)
userRouter.get('/', authorize, adminOnly, getUsers)   // Recuperer tous les utilisateurs

// @acces Prive (le propriétaire du profil ou un admin)
userRouter.get('/:id', authorize, getUserProfile ) // Recuperer le profil d'un utilisateur

// @acces Prive (le propriétaire du profil ou un admin)
userRouter.put('/:id', authorize, updateUserProfile)   // Modifier le profil d'un utilisateur

// @acces Prive (admin-only)
userRouter.delete('/:id', authorize, adminOnly, deleteUserProfile) // Supprimer un utilisateur

userRouter.post('/', createUser)


export default userRouter