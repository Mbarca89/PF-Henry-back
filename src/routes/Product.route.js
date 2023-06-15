import Router from 'express';
import {postProduct, getProductById, getAllProducts, getFromSeller} from '../controllers/Product.controller.js'



const productRoutes = Router();

productRoutes.post('/post', postProduct)
productRoutes.post('/', getAllProducts)
productRoutes.get('/detail/:id', getProductById)
productRoutes.get('/:userId',getFromSeller)


export default productRoutes;