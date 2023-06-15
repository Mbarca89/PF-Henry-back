import Router from 'express';
import {addProduct, getCart} from '../controllers/Cart.controller.js';



const cartRoutes = Router();

cartRoutes.post('/add', addProduct)
cartRoutes.get('/get/:userId', getCart)



export default cartRoutes;