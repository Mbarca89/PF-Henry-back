import Router from 'express';
import addProduct from '../controllers/Cart.controller.js';



const cartRoutes = Router();

cartRoutes.post('/add', addProduct)



export default cartRoutes;