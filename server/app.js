import express from 'express';
import { PORT } from './config/env.js'
import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'
import taskRouter from './routes/task.routes.js';

const app = express()

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/tasks', taskRouter)



app.get('/', (req, res) => {
  res.send("Bienvenue sur l'API de Tasky")
});

app.listen(PORT, () => {
  console.log(`Le serveur tourne sur http://localhost:${PORT}`)
});

export default app