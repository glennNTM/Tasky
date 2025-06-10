import { config } from "dotenv"

config({path: '.env'})

// eslint-disable-next-line no-undef
const { 
  PORT, 
  MONGODB_URI, 
  JWT_SECRET, 
  JWT_EXPIRES_IN, 
  SESSION_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  VITE_API_URL,
// eslint-disable-next-line no-undef
} = process.env

if (!SESSION_SECRET) {
  console.error("Erreur: La variable d'environnement SESSION_SECRET n'est pas définie.");
}
export { 
  PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN, SESSION_SECRET,
  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, VITE_API_URL
}