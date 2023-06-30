
import Router from 'express';
import productRoutes from './Product.route.js';
import userRoutes from './User.route.js';
import cartRoutes from './Cart.route.js';
import loginRoutes from './Login.route.js';
import statsRoutes from './Stats.route.js';
import '../passport/google-auth.js'
import passport from 'passport';
import orderRoutes from "./Order.route.js";
import categoryRoutes from "./Category.route.js";
import paymentRoutes from './Payments.route.js';
import verifyToken from '../middlewares/VerifyToken.js';

const router = Router();

router.use('/products', productRoutes)
router.use('/users', userRoutes);
router.use('/cart', cartRoutes);
router.use('/stats', statsRoutes);
router.use('/auth/google',passport.authenticate('sign-in-google',{
    scope:[
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
    ],
    session: false
}), loginRoutes)
router.use('/auth/login', loginRoutes)
router.use("/orders",verifyToken, orderRoutes);
router.use("/categories", categoryRoutes);
router.use('/checkout', paymentRoutes)


export default router;
