import Router from 'express';
import createUser from '../controllers/User.controller.js';



const userRoutes = Router();

userRoutes.post('/register', createUser)



export default userRoutes;