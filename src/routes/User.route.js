import Router from 'express';
import {
    createUser,
    getUsers,
    getSellers,
    activateUser,
    getPurchasedProducts,
    getClients,
    changeActivation,
    forgotPassword,
    resetPassword
} from '../controllers/User.controller.js';

const userRoutes = Router();

userRoutes.post('/register', createUser)
userRoutes.get('/', getUsers)
userRoutes.get('/sellers', getSellers)
userRoutes.get('/clients', getClients)
userRoutes.get('/activate/:token', activateUser)
userRoutes.get('/purchasedproducts/:userId', getPurchasedProducts)
userRoutes.put('/changeactivation/:userId', changeActivation)
userRoutes.put('/forgotpassword', forgotPassword)
userRoutes.put('/resetpassword/:passwordToken', resetPassword)


export default userRoutes;