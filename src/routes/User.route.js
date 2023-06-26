import Router from 'express';
import {createUser, getUsers, getSellers, activateUser, getPurchasedProducts} from '../controllers/User.controller.js';
import { get } from 'mongoose';



const userRoutes = Router();

userRoutes.post('/register', createUser)
userRoutes.get('/', getUsers)
userRoutes.get('/sellers', getSellers)
userRoutes.get('/activate/:token', activateUser)
userRoutes.get('/purchasedproducts', getPurchasedProducts)


export default userRoutes;