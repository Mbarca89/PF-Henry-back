import Router from 'express';
import {
    createUser,
    getUsers,
    getSellers,
    activateUser,
    resendActivation,
    getPurchasedProducts,
    getClients,
    changeActivation,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser
} from '../controllers/User.controller.js';

const userRoutes = Router();

userRoutes.post('/register', createUser)
userRoutes.get('/', getUsers)
userRoutes.get('/sellers', getSellers)
userRoutes.get('/clients/:userId', getClients)
userRoutes.get('/activate/:token', activateUser)
userRoutes.get('/purchasedproducts/:userId', getPurchasedProducts)
userRoutes.put('/changeactivation/:userId', changeActivation)
userRoutes.put('/resendactivation', resendActivation)
userRoutes.put('/forgotpassword', forgotPassword)
userRoutes.put('/resetpassword/:passwordToken', resetPassword)
userRoutes.put('/changepassword', changePassword)
userRoutes.put('/updateuser', updateUser)


export default userRoutes;