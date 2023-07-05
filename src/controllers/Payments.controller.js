import mercadopago from "mercadopago";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from '../models/Product.js'
import { FRONT_HOST, MERCADO_PAGO_API_KEY, HOST } from "../../config.js";
import transporter from "../libs/nodemailer.js";

export const createOrder = async (req, res) => {
    const { productList, orderId } = req.body
    const items = productList.map((product) => {
        return {
            title: product.name,
            unit_price: product.unityPrice,
            currency_id: "ARS",
            quantity: product.quantity
        }
    })

    mercadopago.configure({
        access_token: `${MERCADO_PAGO_API_KEY}`,
    });
    const result = await mercadopago.preferences.create({
        items,
        // Bakc Urls es a donde envia las respuestas  
        back_urls: {
            success: `${HOST}/checkout/success/${orderId}`,
            failure: `${HOST}/checkout/failure`,
            pending: `${HOST}/checkout/pending`,
        },
        notification_url: "https://ae8f-170-150-8-35.sa.ngrok.io/webhook",
    })

    res.send(result.body);
};

export const receiveWebhook = async (req, res) => {
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

export const success = async (req, res) => {
    try {
        const { orderId } = req.params
        const order = await Order.findById(orderId)
        if (!order) throw Error('Orden no encontrada!')
        const user = await User.findById(order.user)
        if (!user) throw Error('Usuario no encontrado!')

        const purchasedProducts = order.productList.map((product) => {
            const isProductExist = user.purchasedProducts.some(item => item.product.equals(product.itemId));
            return !isProductExist ? { product: product.itemId } : undefined
        })

        const filteredProducts = purchasedProducts.filter(item => item !== undefined);

        user.purchasedProducts.push(...filteredProducts)

        await user.save()

        for (const product of order.productList) {
            const foundProduct = await Product.findById(product.itemId)
            if (!foundProduct) throw Error('Producto no encontrado!')
            foundProduct.stock -= Number(product.quantity)

            const seller = await User.findById(foundProduct.seller)
            if (!seller) throw Error('Vendedor no encontrado!')
            seller.clients.push({
                product: foundProduct._id,
                quantity: product.quantity,
                user: order.user
            })

            await foundProduct.save()
            await seller.save()
        }

        let mailBody = '<h1>Gracias por tu compra!</h1><p>Tu pedido ha sido recibido y se estará procesando en un plazo de 24 a 48 horas.</p><h2>Aqui tienes un detalle de tus compras:</h2><table><tr><th>Nombre</th><th>Precio Unitario</th><th>Cantidad</th><th>Precio Total</th></tr>'

        await order.productList.forEach(product => {
            mailBody += `<tr><td>${product.itemName}</td><td>${product.unityPrice}</td><td>${product.quantity}</td><td>${product.total}</td></tr>`
        })

        mailBody += `<tr><td colspan="3">Monto Total</td><td>${order.totalOrderAmount}</td></tr></table>`

        const mailOptions = {
            from: 'naturessence23@gmail.com',
            to: user.email,
            subject: 'Gracias por tu compra!',
            html: mailBody
        };

        await transporter.sendMail(mailOptions)

        order.status = 'completed'
        await order.save()

        return res.redirect(`${FRONT_HOST}/success`)

    } catch (error) {
        return res.status(400).send(error.message)
    }
}

export const failure = async (req, res) => {
    return res.redirect(`${FRONT_HOST}/failure`)
}


