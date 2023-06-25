import { config } from "dotenv";
config();

export const MONGODB_URI = process.env.MONGODB_URI;
export const PORT = process.env.PORT;

export const CLOUD_NAME = process.env.CLOUD_NAME;
export const API_KEY = process.env.API_KEY;
export const API_SECRET = process.env.API_SECRET;

//google
export const CLIENT_ID = process.env.CLIENT_ID
export const CLIENT_SECRET = process.env.CLIENT_SECRET
export const CALLBACK_URL = process.env.CALLBACK_URL
//MERCADO PAGO 
//export const PORT = 4000
export const HOST = process.env.HOST
export const MERCADO_PAGO_API_KEY = process.env.MERCADO_PAGO_API_TOKEN

//NodeMailer

export const MAIL_PASSWORD = process.env.MAIL_PASSWORD

export const FRONT_HOST = process.env.FRONT_HOST