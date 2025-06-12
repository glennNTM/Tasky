import { Router } from 'express'
import passport from 'passport'
import { register, login, logout, oauthCallback } from '../controllers/auth.controller.js'

const authRouter = Router()

authRouter.post('/register', register)  // Enregistrer un Utilisateur
authRouter.post('/login', login)        // Se connecter
authRouter.post('/logout', logout)      // Se deconnecter

// --- Routes pour Oauth Google ---
// Lance le processus d'authentification Google
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
// Gère le retour de Google après l'authentification
authRouter.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }), // session: false car nous utilisons JWT
  oauthCallback 
)

// --- Routes pour Oauth GitHub ---
// Lance le processus d'authentification GitHub
authRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }))
// Gère le retour de GitHub après l'authentification
authRouter.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login', session: false }), // session: false car nous utilisons JWT
  oauthCallback 
)

export default authRouter