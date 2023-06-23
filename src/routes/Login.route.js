import { Router } from "express";
import {Login, googleLogin} from "../controllers/Login.controller.js";
import axios from "axios";

const loginRoutes = Router();

loginRoutes.get('/googlelogin', googleLogin)
// loginRoutes.get('/', Login)
loginRoutes.post("/", Login);
loginRoutes.get('/loginprueba',async (req,res) => {
    try {
        const {data} = await axios.get('http://localhost:3000/auth/google')
        return res.json(data)
    } catch (error) {
        return res.status(400).json(error)
    }
})



export default loginRoutes;

