import { config } from "dotenv"

config({path: '.env'})

// eslint-disable-next-line no-undef
export const { PORT, MONGODB_URI, JWT_SECRET,JWT_EXPIRES_IN } = process.env