import Order from "../models/Order.js";

const postOrder = async (req, res) => {
  try {
    const { user, products } =
      req.body; // Change 'body' to 'req.body'

    const productList = products.map((product) => {
      return {
        itemName: product.product.name,
        unityPrice: product.product.price,
        quantity: product.quantity,
        total: product.product.price * product.quantity,
      }
    })

    const totalOrderAmount = productList.reduce((totalAmount, product) => {
      return totalAmount + product.total
    }, 0)

    const newOrder = await Order.create({
      user,
      totalOrderAmount,
      productList
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: "Error postOrder", message: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params
    if (!orderId) throw Error('Se necesita el ID de la orden')

    const order = await Order.findById(orderId)
    if (!order) throw Error('Orden no encontrada')

    return res.status(200).json(order)
  } catch (error) {
    return res.status(400).send(error.message)
  }
}

const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params
    if (!userId) throw Error('Falta la ID del usuario')

    const orders = await Order.find({ user: userId })
    if (!orders) throw Error('Error al obtener ordenes')

    return res.status(200).json(orders)
  } catch (error) {
    return res.status(400).send(error.message)
  }
}

export { postOrder, getOrder, getUserOrders };
