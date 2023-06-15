import Router from 'express';
import {createUser, getUsers} from '../controllers/User.controller.js';



const userRoutes = Router();

userRoutes.post('/register', createUser)
userRoutes.get('/', getUsers)



export default userRoutes;