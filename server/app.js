import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { PORT, SESSION_SECRET } from './config/env.js';
import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'
import taskRouter from './routes/task.routes.js'
import connectToDatabase from './database/mongodb.js'
import errorMiddleware from './middlewares/error.middleware.js'
import cors from 'cors'
import { configurePassport } from './config/passport.config.js'
import passport from 'passport'


const app = express()



// Middleware pour gérer les CORS
app.use(cors({
  origin: 'http://localhost:8080', // Port de votre serveur de développement Vite
  credentials: true // Autorise l'envoi des cookies et des en-têtes d'autorisation
}))

// Middleware de sécurité Helmet (protection XSS de base et autres en-têtes de sécurité)
app.use(helmet())

// Middleware pour gerer le format des donnees
app.use(express.json())

// Middleware pour parser les cookies (requis pour express-session)
app.use(cookieParser())
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      // eslint-disable-next-line no-undef
      secure: process.env.NODE_ENV === 'production', // Mettre à true si vous êtes en HTTPS (production)
      httpOnly: true, // Empêche l'accès au cookie de session via JavaScript côté client
      sameSite: 'strict', // Protection supplémentaire contre les attaques CSRF
    },
  })
);

// --- Configuration de Passport ---
configurePassport()

// --- Initialiser Passport et sa session ---
app.use(passport.initialize());
app.use(passport.session()); // Doit être après express-session

// Middleware de protection CSRF

// Routes
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/tasks', taskRouter)

app.get('/', (req, res) => {
  res.send("Bienvenue sur l'API de Tasky")
})


// Le middleware de gestion des erreurs doit être le dernier middleware
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`Le serveur tourne sur http://localhost:${PORT}`)

  await connectToDatabase()
})

export default app