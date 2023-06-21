import Router from 'express';
import {createUser, getUsers, getSellers} from '../controllers/User.controller.js';



const userRoutes = Router();

userRoutes.post('/register', createUser)
userRoutes.get('/', getUsers)
userRoutes.get('/sellers', getSellers)



export default userRoutes;