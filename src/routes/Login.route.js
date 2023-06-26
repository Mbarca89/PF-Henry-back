import { Router } from "express";
import {Login, googleLogin} from "../controllers/Login.controller.js";
import axios from "axios";
import { HOST } from "../../config.js";

const loginRoutes = Router();

loginRoutes.get('/googlelogin', googleLogin)
loginRoutes.post("/", Login);


export default loginRoutes;

