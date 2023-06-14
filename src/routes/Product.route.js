import Router from 'express';
import {postProduct, getProductById, getAllProducts} from '../controllers/Product.controller.js'



const productRoutes = Router();

productRoutes.post('/post', postProduct)
productRoutes.get('/', getAllProducts)
productRoutes.get('/detail/:id', getProductById)


export default productRoutes;