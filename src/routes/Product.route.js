import Router from 'express';
import {postProduct, getProductById} from '../controllers/Product.controller.js'



const productRoutes = Router();

productRoutes.post('/post', postProduct)
productRoutes.get('/detail/:id', getProductById)


export default productRoutes;