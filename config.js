import { config } from "dotenv";
config();

export const MONGODB_URI = process.env.MONGODB_URI;
export const PORT = process.env.PORT;

export const CLOUD_NAME = process.env.CLOUD_NAME;
export const API_KEY = process.env.API_KEY;
export const API_SECRET = process.env.API_SECRET;

export const CLIENT_ID = process.env.CLIENT_ID
export const CLIENT_SECRET = process.env.CLIENT_SECRET
export const CALLBACK_URL = process.env.CALLBACK_URL
//MERCADO PAGO 
//export const PORT = 4000
export const HOST = `http://localhost:${PORT}`
export const MERCADO_PAGO_API_KEY = process.env.MERCADO_PAGO_API_TOKEN