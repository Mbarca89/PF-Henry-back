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

export { postOrder };
