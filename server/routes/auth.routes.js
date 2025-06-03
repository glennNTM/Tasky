import { Router } from 'express'
import { register, login, logout } from '../controllers/auth.controller.js'

const authRouter = Router()

authRouter.post('/register', register)  // Enregistrer un Utilisateur
authRouter.post('/login', login)        // Se connecter
authRouter.post('/logout', logout)      // Se deconnecter

export default authRouter