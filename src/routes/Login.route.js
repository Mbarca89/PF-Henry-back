import { Router } from "express";
import {Login, googleLogin} from "../controllers/Login.controller.js";

const loginRoutes = Router();

loginRoutes.get('/googlelogin', googleLogin)
loginRoutes.get('/', Login)



export default loginRoutes;

