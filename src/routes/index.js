import Router from 'express';
import productRoutes from './Product.route.js';

const router = Router();

router.use('/products', productRoutes)

export default router;