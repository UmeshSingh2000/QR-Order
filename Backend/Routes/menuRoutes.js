const express = require('express');
const { addMultipleMenuItems, addMenuItem, deleteMenuItem, getMenuItem, deleteSection, createSection } = require('../Controller/menuController');
const router = express.Router();

router.get('/getMenuItem',getMenuItem)
router.post('/createSection',createSection)
router.post('/addMenuItem', addMenuItem);
router.post('/addMultipleMenuItems',addMultipleMenuItems)
router.delete('/deleteMenuItem/:sectionname/:itemname', deleteMenuItem);
router.delete('/deleteSection/:sectionname', deleteSection);
module.exports = router;