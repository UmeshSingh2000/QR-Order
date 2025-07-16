const express = require('express');
const { addMenuItem } = require('../Controller/menuController');
const router = express.Router();

router.post('/addMenuItem', addMenuItem)