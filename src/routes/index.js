
import Router from 'express';
import productRoutes from './Product.route.js';
import userRoutes from './User.route.js';
import cartRoutes from './Cart.route.js';
import loginRoutes from './Login.route.js';
import '../passport/google-auth.js'
import passport from 'passport';
import orderRoutes from "./Order.route.js";
import categoryRoutes from "./Category.route.js";

const router = Router();

router.use('/products', productRoutes)
router.use('/users', userRoutes);
router.use('/cart', cartRoutes);
router.use('/auth/google',passport.authenticate('sign-in-google',{
    scope:[
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
    ],
    session: false
}), loginRoutes)
router.use('/auth/login', loginRoutes)
router.use("/orders", orderRoutes);
router.use("/categories", categoryRoutes);


export default router;
