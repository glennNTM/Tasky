// passport.config.js
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GitHubStrategy } from 'passport-github'
import User from '../models/user.model.js' // Assurez-vous d'avoir ces variables dans votre .env
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, VITE_API_URL as CLIENT_URL } from './env.js'

export const configurePassport = () => {
  // --- Configuration de la sérialisation/désérialisation de l'utilisateur ---
  // Ces fonctions sont utilisées par Passport pour stocker l'utilisateur dans la session
  // et le récupérer à partir de son ID.
  passport.serializeUser((user, done) => {
    // Stocke uniquement l'ID de l'utilisateur dans la session
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      // Récupère l'utilisateur complet à partir de son ID stocké en session
      const user = await User.findById(id)
      done(null, user)
    } catch (err) {
      done(err, null)
    }
  })

  // --- Stratégie Google OAuth ---
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID, // Votre ID client Google
    clientSecret: GOOGLE_CLIENT_SECRET, // Votre secret client Google
    callbackURL: `${CLIENT_URL}/api/auth/google/callback` // URL de rappel pour Google (doit correspondre à celle configurée chez Google)
  },
  async (accessToken, refreshToken, profile, done) => {
    // Cette fonction est appelée après que Google a authentifié l'utilisateur
    try {
      // Recherche un utilisateur existant avec cet ID Google
      let user = await User.findOne({ googleId: profile.id })

      if (user) {
        // Si l'utilisateur existe déjà, on le connecte
        return done(null, user)
      } else {
        // Si l'utilisateur n'existe pas avec cet ID Google,
        // on vérifie si un utilisateur avec la même adresse email existe déjà.
        // Cela permet de lier un compte social à un compte local existant.
        user = await User.findOne({ email: profile.emails[0].value })
        if (user) {
          // Lie l'ID Google au compte existant
          user.googleId = profile.id
          await user.save()
          return done(null, user)
        }

        // Si aucun utilisateur n'est trouvé, crée un nouvel utilisateur
        const newUser = await User.create({
          googleId: profile.id,
          fullname: profile.displayName,
          email: profile.emails[0].value,
          profileImageUrl: profile.photos[0].value,
          // Pour les utilisateurs OAuth, le mot de passe n'est pas géré directement par eux.
          // On peut mettre une valeur par défaut ou marquer le champ comme non applicable.
          password: 'N/A' // Ou une chaîne aléatoire générée, ou rendre le champ facultatif
        })
        return done(null, newUser)
      }
    } catch (err) {
      // Gère les erreurs lors de l'authentification
      return done(err, null)
    }
  }))

  // --- Stratégie GitHub OAuth ---
  passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID, // Votre ID client GitHub
    clientSecret: GITHUB_CLIENT_SECRET, // Votre secret client GitHub
    callbackURL: `${CLIENT_URL}/api/auth/github/callback` // URL de rappel pour GitHub (doit correspondre à celle configurée chez GitHub)
  },
  async (accessToken, refreshToken, profile, done) => {
    // Cette fonction est appelée après que GitHub a authentifié l'utilisateur
    try {
      // Recherche un utilisateur existant avec cet ID GitHub
      let user = await User.findOne({ githubId: profile.id })

      if (user) {
        // Si l'utilisateur existe déjà, on le connecte
        return done(null, user)
      } else {
        // Vérifie si un utilisateur avec la même adresse email existe déjà.
        // GitHub ne fournit pas toujours l'email public, donc on le vérifie.
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        if (email) {
            user = await User.findOne({ email });
            if (user) {
                // Lie l'ID GitHub au compte existant
                user.githubId = profile.id;
                await user.save();
                return done(null, user);
            }
        }
        
        // Si aucun utilisateur n'est trouvé, crée un nouvel utilisateur
        const newUser = await User.create({
          githubId: profile.id,
          fullname: profile.displayName || profile.username, // Utilise le nom d'affichage ou le nom d'utilisateur
          email: email, // L'email peut être null si non public
          profileImageUrl: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
          password: 'N/A' // Ou une chaîne aléatoire générée
        })
        return done(null, newUser)
      }
    } catch (err) {
      // Gère les erreurs lors de l'authentification
      return done(err, null)
    }
  }))
}