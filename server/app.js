import express from 'express';
import { PORT } from './config/env.js'

const app = express()

app.get('/', (req, res) => {
  res.send("Bienvenue sur l'API de Tasky")
});

app.listen(PORT, () => {
  console.log(`Le serveur tourne sur http://localhost:${PORT}`)
});

export default app