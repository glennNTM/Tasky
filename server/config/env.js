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

const requiredEnvVars = {
  PORT,
  MONGODB_URI,
  JWT_SECRET,
  SESSION_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  VITE_API_URL
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    console.error(`Erreur: La variable d'environnement ${key} n'est pas définie.`);
    // eslint-disable-next-line no-undef
    process.exit(1); // Arrête l'application si une variable requise est manquante
  }
}
export { 
  PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN, SESSION_SECRET,
  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, VITE_API_URL
}