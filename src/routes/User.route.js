import Router from 'express';
import {createUser, getUsers, getSellers, activateUser} from '../controllers/User.controller.js';



const userRoutes = Router();

userRoutes.post('/register', createUser)
userRoutes.get('/', getUsers)
userRoutes.get('/sellers', getSellers)
userRoutes.get('/activate/:token', activateUser)


export default userRoutes;