import Router from 'express';
import {
    postProduct,
    getProductById,
    getAllProducts,
    getFromSeller,
    updateProduct,
    postReview,
    changeActivation
} from '../controllers/Product.controller.js'



const productRoutes = Router();

productRoutes.post('/post', postProduct)
productRoutes.post('/postreview', postReview)
productRoutes.post('/', getAllProducts)
productRoutes.get('/detail/:id', getProductById)
productRoutes.get('/:userId', getFromSeller)
productRoutes.put('/changeactivation/:productId', changeActivation)
productRoutes.put("/", updateProduct);


export default productRoutes;