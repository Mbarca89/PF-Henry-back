import Router from 'express';
import {
    postProduct,
    getProductById,
    getAllProducts,
    getFromSeller,
    updateProduct,
    postReview,
    changeActivation,
    getOffers,
    deleteProduct,
} from '../controllers/Product.controller.js'



const productRoutes = Router();

productRoutes.post('/post', postProduct)
productRoutes.post('/postreview', postReview)
productRoutes.post('/', getAllProducts)
productRoutes.get('/offers', getOffers)
productRoutes.get('/detail/:id', getProductById)
productRoutes.get('/:userId', getFromSeller)
productRoutes.put('/changeactivation/:productId', changeActivation)
productRoutes.put("/", updateProduct);
productRoutes.delete('/products/:id',deleteProduct);



export default productRoutes;