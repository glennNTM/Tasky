import User from "../models/user.model.js"
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../config/env.js"

// Middleware pour protéger les routes
export const authorize = async (req, res, next) => {
  try {
    let token

    // ✅ Vérifie si un token est présent dans l'en-tête Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    // ❌ Aucun token trouvé
    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé : token manquant.' })
    }

    // ✅ Vérifie la validité du token
    const decoded = jwt.verify(token, JWT_SECRET)

    // 🔍 Recherche de l’utilisateur à partir de l’ID contenu dans le token
    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable.' })
    }

    // ✅ Ajoute l’utilisateur à l’objet req pour les prochains middlewares
    req.user = user

    // ⏭ Passe au prochain middleware ou contrôleur
    next()

  } catch (error) {
    console.error('Erreur dans authorize:', error)
    res.status(401).json({ message: 'Accès non autorisé.' })
  }
}


// Middleware pour les routes Admin-only
export const adminOnly = async (req, res, next) =>{
  if(req.user && req.user.role === "admin"){
    next()
}else{
  res.status(403).json({ message: "Acces refuse, admin only"})
}
}

