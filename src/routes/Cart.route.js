import Router from 'express';
import {addProduct, getCart, removeProduct, removeAllProducts} from '../controllers/Cart.controller.js';



const cartRoutes = Router();

cartRoutes.post('/add', addProduct)
cartRoutes.get('/get/:userId', getCart)
cartRoutes.delete('/remove', removeProduct)
cartRoutes.delete('/removeall/:cartId', removeAllProducts)



export default cartRoutes;