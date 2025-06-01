import { config } from "dotenv"

config({path: '.env'})

// eslint-disable-next-line no-undef
export const { PORT } = process.env