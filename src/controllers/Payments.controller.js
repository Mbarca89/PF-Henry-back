import mercadopago from "mercadopago";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from '../models/Product.js'
import { HOST,MERCADO_PAGO_API_KEY } from "../../config.js";

export const createOrder = async  (req, res)=> {
    const {productList, orderId} = req.body
    const items = productList.map((product) => {
        return {
            title: product.name,
            unit_price: product.unityPrice,
            currency_id:"ARS",
            quantity: product.quantity
        }
    })
    
     mercadopago.configure({
        access_token: `${MERCADO_PAGO_API_KEY}`,
     });
     const result =  await mercadopago.preferences.create({
        items,
       // Bakc Urls es a donde envia las respuestas  
        back_urls:{
            success: `${HOST}/checkout/success/${orderId}`,
            failure: `${HOST}/checkout/failure`,
            pending: `${HOST}/checkout/pending`,
        },
        notification_url:"https://ae8f-170-150-8-35.sa.ngrok.io/webhook",
     })

    res.send(result.body);
};

export const receiveWebhook = async  (req, res)=> {
const payment = req.query
    try {
        
    if (payment.type === "payment") {
        const data = await mercadopago.payment.findById(payment['data.id'])
        //Store in database 
}
    res.sendStatus(204);
    } catch (error) {
        return res.sendStatus(500).json({ error: error.message });
    }
}

export const success = async (req,res)=> {
    try {
        const {orderId} = req.params
        const order = await Order.findById(orderId)
        if(!order) throw Error ('Orden no encontrada')

        const user = await User.findById(order.user)
        if(!user) throw Error ('Usuario no encontrado')

        const purchasedProducts = order.productList.map((product) => ({
            product: product.itemId
        }))

        user.purchasedProducts.push(...purchasedProducts)
        await user.save()

        for (const product of order.productList) {
            const foundProduct = await Product.findById(product.itemId)
            if(!foundProduct) throw Error ('Producto no encontrado')
            foundProduct.stock -= Number(product.quantity)
            await foundProduct.save()
        }

        return res.redirect(`${HOST}/products`)

    } catch (error) {
        return res.status(400).send(error.message)
    }
}


