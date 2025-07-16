const router = require('express').Router();
const { createOrder, getAllOrders, getOrderById } = require('../Controller/orderController');

router.post('/create-order', createOrder);
router.get('/get-order', getAllOrders);
router.get('/:id', getOrderById);

module.exports = router;
