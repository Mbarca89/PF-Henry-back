import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from '../models/User.js'
import mongoose from "mongoose";

const getStats = async (req, res) => {
    try {
        const users = await User.countDocuments()
        const products = await Product.countDocuments()
        const sales = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$totalOrderAmount' }
                }
            }
        ]);

        return res.status(200).json({users,products,sales:sales[0].totalAmount})
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

const getUserStats = async (req, res) => {
    try {
        const {userId} = req.params
        let uniqueClientsCount = 0
        User.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(userId) } },
            { $unwind: '$clients' },
            { $group: { _id: '$clients.user' } },
            { $count: 'count' }
          ])
            .exec((err, result) => {
              if (err) {
                throw Error ('algo paso')
              } else {
                uniqueClientsCount = result[0]?.count || 0
              }
            });
        const products = await Product.countDocuments({seller:userId})

        const user = await User.findById(userId).populate('clients.product', 'name price hasDiscount discount')
        if (!user) throw Error('Usuario no encontrado!')
        const soldProducts = user.clients.map(client => {
            const { price, hasDiscount, discount } = client.product;
            return {
                product: {
                    productPrice: price,
                    productHasDiscount: hasDiscount,
                    productDiscount: discount
                },
                quantity: client.quantity
            };
        });

        const totalSales = soldProducts.reduce((total, soldProduct) => {
            const { product, quantity } = soldProduct;
            const { productPrice, productHasDiscount, productDiscount } = product;
          
            if (productHasDiscount) {
              const discountedPrice = productPrice * (1 - productDiscount / 100);
              return total + discountedPrice * quantity;
            } else {
              return total + productPrice * quantity;
            }
          }, 0);

        return res.status(200).json({users:uniqueClientsCount,products, totalSales})
    } catch (error) {
        return res.status(400).send(error.message)
    }
}
export  {getStats, getUserStats}