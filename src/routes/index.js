import Router from 'express';
import productRoutes from './Product.route.js';
import userRoutes from './User.route.js';

const router = Router();

router.use('/products', productRoutes)
router.use('/users', userRoutes);

export default router;