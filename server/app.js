import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import csrf from 'csurf';
import { PORT, SESSION_SECRET } from './config/env.js';
import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'
import taskRouter from './routes/task.routes.js'
import connectToDatabase from './database/mongodb.js'
import errorMiddleware from './middlewares/error.middleware.js'
import cors from 'cors'


const app = express()

// Middleware pour gérer les CORS
// Le port par défaut de Vite est 5173, mais utilisez celui de votre configuration.
app.use(cors({
  origin: 'http://localhost:8080', // Port de votre serveur de développement Vite
  credentials: true // Autorise l'envoi des cookies et des en-têtes d'autorisation
}))

// Middleware de sécurité Helmet (protection XSS de base et autres en-têtes de sécurité)
app.use(helmet())

// Middleware pour gerer le format des donnees
app.use(express.json())

// Middleware pour parser les cookies (requis pour csurf si option cookie: true)
app.use(cookieParser())

// Middleware de session (requis pour csurf)
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

// Middleware de protection CSRF
// Doit être configuré APRÈS cookieParser et session.
const csrfProtection = csrf({ cookie: true }); // Stocke le secret CSRF dans un cookie _csrf
app.use(csrfProtection);

// Middleware pour rendre le token CSRF disponible pour les templates ou les réponses API si nécessaire
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Routes
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/tasks', taskRouter)

app.get('/', (req, res) => {
  res.send("Bienvenue sur l'API de Tasky")
})

// Route pour que les clients obtiennent le token CSRF
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Le middleware de gestion des erreurs doit être le dernier middleware
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`Le serveur tourne sur http://localhost:${PORT}`)

  await connectToDatabase()
})

export default app