const express = require('express');
const { addMultipleMenuItems, addMenuItem, deleteMenuItem, getMenuItem } = require('../Controller/menuController');
const router = express.Router();

router.get('/getMenuItem',getMenuItem)
router.post('/addMenuItem', addMenuItem);
router.post('/addMultipleMenuItems',addMultipleMenuItems)
router.delete('/deleteMenuItem', deleteMenuItem);

module.exports = router;