import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const addProduct = async (req,res) => {
    try {
        const { id, quantity, userId } = req.body
        
        const product = await Product.findById(id)
        if (!product) throw Error('Producto no encontrado')

        if(product.stock < quantity) throw Error ('No hay stock disponible')

        const userCart = await Cart.findOne({user:userId})
        if (!userCart) throw Error('No existe el carrito')
        
        userCart.products.push({product:id, quantity, price:product.price})
        await userCart.save()

        return res.status(200).send('Producto agregado correctamente!')
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

export default addProduct