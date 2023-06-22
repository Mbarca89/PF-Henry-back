import mercadopago from "mercadopago";
import { HOST,MERCADO_PAGO_API_KEY } from "../../config.js";

export const createOrder = async  (req, res)=> {
    const {productList} = req.body
    console.log(MERCADO_PAGO_API_KEY)
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
            success: `${HOST}/checkout/success`,
            failure: `${HOST}/checkout/failure`,
            pending: `${HOST}/checkout/pending`,
        },
        notification_url:"https://ae8f-170-150-8-35.sa.ngrok.io/webhook",
     })
     console.log(result)

    res.send(result.body);
};

export const receiveWebhook = async  (req, res)=> {
const payment = req.query
    try {
        
    if (payment.type === "payment") {
        const data = await mercadopago.payment.findById(payment['data.id'])
        console.log (data)
        //Store in database 
}
    res.sendStatus(204);
    } catch (error) {
        console.log(error)
        return res.sendStatus(500).json({ error: error.message });
    }
}


