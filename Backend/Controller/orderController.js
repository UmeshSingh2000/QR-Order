const Order = require('../Database/Models/orderSchema');
const Menu = require('../Database/Models/menuSchema')

const createOrder = async (req, res) => {
    try {
        const { tableNumber, items, totalAmount } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Order must include at least one item' });
        }

        const newOrder = new Order({ tableNumber, items, totalAmount });
        const savedOrder = await newOrder.save();

        res.status(201).json({savedOrder});
        console.log(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    const ordersWithNames = [];

    for (const order of orders) {
      const detailedItems = [];

      for (const item of order.items) {
        const menu = await Menu.findOne({ 'menuitems._id': item.itemId });

        if (menu) {
          const menuItem = menu.menuitems.id(item.itemId); // Mongoose subdocument lookup
          const size = item.size;
          const itemPrice = menuItem.price.get(size);
          detailedItems.push({
            itemname: menuItem?.itemname,
            quantity: item.quantity,
            price: itemPrice, // optional
            size: item.size,
          });
        }
      }

      ordersWithNames.push({
        _id: order._id,
        tableNumber: order.tableNumber,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        items: detailedItems
      });
    }

    res.json(ordersWithNames);
  } catch (err) {
    console.error('Error fetching orders with names:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate('items.itemId');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById
};