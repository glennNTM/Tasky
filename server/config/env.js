import { config } from "dotenv"

config({path: '.env'})

// eslint-disable-next-line no-undef
const { PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN, SESSION_SECRET } = process.env

if (!SESSION_SECRET) {
  console.error("Erreur: La variable d'environnement SESSION_SECRET n'est pas définie.");
}
export { PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN, SESSION_SECRET }