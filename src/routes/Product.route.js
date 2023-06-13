import Router from 'express';
import postProduct from '../controllers/Product.controller.js'



const productRoutes = Router();

productRoutes.post('/post', postProduct)


export default productRoutes;