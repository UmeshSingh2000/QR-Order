const express = require('express');
const { addMultipleMenuItems, addMenuItem, deleteMenuItem } = require('../Controller/menuController');
const router = express.Router();

router.post('/addMenuItem', addMenuItem);
router.post('/addMultipleMenuItems',addMultipleMenuItems)
router.delete('/deleteMenuItem', deleteMenuItem);

module.exports = router;