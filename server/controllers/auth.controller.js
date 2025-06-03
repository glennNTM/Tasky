import mongoose from "mongoose"
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js"

// @desc Enregistrer un nouvel utilisateur
// @route POST /api/auth/register
// @acces Public
export const register = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { fullname, email, password } = req.body

    // Vérifie si les champs requis sont bien présents
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' })
    }

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      const error = new Error('Cet utilisateur existe déjà.')
      error.statusCode = 409
      throw error
    }

    // Hashe le mot de passe
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Crée un nouvel utilisateur avec session MongoDB
    const newUser = await User.create([{
      fullname,
      email,
      
      password: hashedPassword
    }], { session })

    // Génère un token JWT
    const token = jwt.sign(
      { userId: newUser[0]._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    await session.commitTransaction()
    session.endSession()

    // Réponse au client
    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès.',
      token,
      user: newUser[0]
    })

  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    next(error)
  }
}

// @desc Connexion d'un utilisateur
// @route POST /api/auth/login
// @acces Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Vérifie les champs
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' })
    }

    // Recherche de l'utilisateur + inclut le mot de passe
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      const error = new Error('Utilisateur non trouvé.')
      error.statusCode = 404
      throw error
    }

    // Vérifie le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      const error = new Error('Mot de passe incorrect.')
      error.statusCode = 401
      throw error
    }

    // Génère un token JWT
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    // Réponse au client
    res.status(200).json({
      success: true,
      message: 'Connexion réussie.',
      token,
      user
    })

  } catch (error) {
    next(error)
  }
}

// @desc Deconnexion d'un utilisateur
// @route POST /api/auth/logout
// @acces Prive
export const logout = async (req, res, next) => {
  try {
    // ⚠️ Si tu gères le token côté frontend (localStorage), la déconnexion est côté client.
    // Ici, on simule la déconnexion en disant au client d'oublier le token

    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie. Veuillez supprimer le token côté client.'
    })

    // Si tu utilises des cookies avec tokens, tu peux les effacer ici avec :
    // res.clearCookie("token").status(200).json({ message: "Déconnecté." })

  } catch (error) {
    next(error)
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la déconnexion."
    })
  }
}
