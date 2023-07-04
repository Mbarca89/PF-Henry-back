import Router from 'express';
import {
    postProduct,
    getProductById,
    getProducts,
    getFromSeller,
    updateProduct,
    postReview,
    changeActivation,
    getOffers,
    deleteProduct,
    getFeatured,
    getAllProdcuts,
    getPhotos
} from '../controllers/Product.controller.js'



const productRoutes = Router();

productRoutes.post('/post', postProduct)
productRoutes.post('/postreview', postReview)
productRoutes.post('/', getProducts)
productRoutes.get('/all', getAllProdcuts)
productRoutes.get('/offers', getOffers)
productRoutes.get('/featured', getFeatured)
productRoutes.get('/detail/:id', getProductById)
productRoutes.get('/:userId', getFromSeller)
productRoutes.get('/photos/:id', getPhotos)
productRoutes.put('/changeactivation/:productId', changeActivation)
productRoutes.put("/", updateProduct);
productRoutes.delete('/:id',deleteProduct);



export default productRoutes;