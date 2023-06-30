import Order from "../models/Order.js";

const postOrder = async (req, res) => {
  try {
    const { user, products } =
      req.body; // Change 'body' to 'req.body'

    const productList = products.map((product) => {
      return {
        itemName: product.product.name,
        itemId: product.product.id,
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
    res.status(400).send(error.message);
  }
};

const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params
    if (!orderId) throw Error('Se necesita el ID de la order.')

    const order = await Order.findById(orderId)
    if (!order) throw Error('order no encontrada!')

    return res.status(200).json(order)
  } catch (error) {
    return res.status(400).send(error.message)
  }
}

const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params
    if (!userId) throw Error('Falta la ID del usuario!')

    const orders = await Order.find({ user: userId })
    if (!orders) throw Error('Error al obtener orderes!')

    return res.status(200).json(orders)
  } catch (error) {
    return res.status(400).send(error.message)
  }
}

const getOrderData = async (req, res) => {
  let dateFrom = 0
  let dateTo = 0
  let result = []
  try {
    const { period } = req.params
    if (!period) throw Error('Falta el periodo a consultar')

    if (period === 'day') {
      const dayOrders = await Order.find({
        orderDate: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 999),
        },
      });

      const hours = [0, 0, 0, 0, 0, 0];

      dayOrders.forEach((order) => {
        const orderDate = new Date(order.orderDate);
        const orderHour = orderDate.getHours();
        const totalOrderAmount = order.totalOrderAmount;

        const hourIndex = Math.floor(orderHour / 4) % 6;

        hours[hourIndex] += totalOrderAmount;
      });

      const sum = hours.reduce((total, value) => total + value, 0);

      return res.status(200).json({ hours, sum });
    }

    if (period === 'week') {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      firstDay.setDate(firstDay.getDate() - firstDay.getDay())
      const lastDay = new Date(firstDay);
      lastDay.setDate(lastDay.getDate() + 7);
      dateFrom = firstDay;
      dateTo = lastDay;

      result = await Order.aggregate([
        {
          $match: {
            orderDate: { $gte: dateFrom, $lt: dateTo }
          }
        },
        {
          $group: {
            _id: { $dayOfWeek: '$orderDate' },
            sum: { $sum: '$totalOrderAmount' }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      const weekOrders = Array(7).fill(0);

      result.forEach((order) => {
        const day = order._id - 1;
        weekOrders[day] = order.sum;
      });
      return res.status(200).json({ sum: result.reduce((total, order) => total + order.sum, 0), weekOrders });
    }

    if (period === 'month') {
      const today = new Date();
      const month = today.getMonth();
      const weeks = [0, 0, 0, 0];
      const orders = await Order.find({
        orderDate: { $gte: new Date(today.getFullYear(), month, 1), $lt: new Date(today.getFullYear(), month + 1, 0) }
      });

      orders.forEach((order) => {
        const orderDate = new Date(order.orderDate);
        const week = Math.floor((orderDate.getDate() - 1) / 7);
        weeks[week] += order.totalOrderAmount;
      });

      const sum = weeks.reduce((total, value) => total + value, 0);

      return res.status(200).json({weeks,sum})
    }

  } catch (error) {
    return res.status(400).send(error.message)
  }
}

export { postOrder, getOrder, getUserOrders, getOrderData };
