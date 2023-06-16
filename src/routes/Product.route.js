import Router from 'express';
import {
    postProduct,
    getProductById,
    getAllProducts,
    getFromSeller,
    updateProduct,
} from '../controllers/Product.controller.js'



const productRoutes = Router();

productRoutes.post('/post', postProduct)
productRoutes.post('/', getAllProducts)
productRoutes.get('/detail/:id', getProductById)
productRoutes.get('/:userId', getFromSeller)
productRoutes.put("/", updateProduct);


export default productRoutes;