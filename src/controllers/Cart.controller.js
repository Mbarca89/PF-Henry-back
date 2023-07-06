import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const getCart = async (req, res) => {
    try {
        const { userId } = req.params
        if (!userId) throw Error('Falta el ID de usuario!')
        const userCart = await Cart.findOne({ user: userId }).populate('products.product')
        if (!userCart) throw Error('No existe el carrito!')

        return res.status(200).json(userCart)
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

const addProduct = async (req, res) => {
    try {
        const { id, quantity, userId } = req.body
        if(userId === '') throw Error ('¡Necesitas iniciar sesión!')
        if(!userId) throw Error ('¡Necesitas iniciar sesión!')
        const product = await Product.findById(id)
        if (!product) throw Error('Producto no encontrado!')

        if (product.stock < quantity) throw Error('No hay stock disponible!')

        const userCart = await Cart.findOne({ user: userId })
        if (!userCart) throw Error('No existe el carrito')

        const existingProduct = userCart.products.find((p) => p.product.equals(product._id));
        if (existingProduct) {
            throw Error('El producto ya se encuentra en el carrito.');
        }

        userCart.products.push({ product: product._id, quantity, price: product.price })
        await userCart.save()

        return res.status(200).send('Producto agregado correctamente!')
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

const removeProduct = async (req, res) => {
    try {
        const { cartId, productId } = req.query

        const cart = await Cart.findById(cartId)
        if (!cart) throw Error('El carrito no existe!')

        cart.products.pull({ product: productId });

        await cart.save()

        return res.status(200).send('Producto eliminado del carrito.');
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

const removeAllProducts = async (req, res) => {
    try {
        const { cartId } = req.params;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error('El carrito no existe!');
        }

        cart.products = [];
        await cart.save();

        return res.status(200).send('Se eliminaron todos los productos del carrito.');
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

export { addProduct, getCart, removeProduct, removeAllProducts }