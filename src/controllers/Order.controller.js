import Order from "../models/Order.js";

const postOrder = async (req, res) => {
  try {
    const {
      userID,
      totalAmount,
      itemName,
      itemQuantity,
      itemPrice,
      orderDate,
    } = req.body; // Change 'body' to 'req.body'

    const newOrder = await Order.create({
      userID,
      totalAmount,
      itemName,
      itemQuantity,
      itemPrice,
      orderDate,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: "Error postOrder", message: error.message });
  }
};

export { postOrder };
