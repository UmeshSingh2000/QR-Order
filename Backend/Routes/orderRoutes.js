const router = require('express').Router();
const { createOrder, getAllOrders, getOrderById } = require('../Controller/orderController');

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);

module.exports = router;
