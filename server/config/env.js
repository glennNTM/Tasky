import { config } from "dotenv"

config({path: '.env'})

// eslint-disable-next-line no-undef
export const { PORT, MONGODB_URI } = process.env