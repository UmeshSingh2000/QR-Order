const Order = require('../Database/Models/orderSchema');

const createOrder = async (req, res) => {
    try {
        const { tableNumber, items, totalAmount } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Order must include at least one item' });
        }

        const newOrder = new Order({ tableNumber, items, totalAmount });
        const savedOrder = await newOrder.save();

        res.status(201).json({savedOrder});
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('items.itemId');
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal Server Error' });
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