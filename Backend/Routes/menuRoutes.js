const express = require('express');
const { addMultipleMenuItems, addMenuItem } = require('../Controller/menuController');
const router = express.Router();

router.post('/addMenuItem', addMenuItem);
router.post('/addMultipleMenuItems',addMultipleMenuItems)

module.exports = router;