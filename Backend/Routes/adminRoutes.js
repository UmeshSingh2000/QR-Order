const router = require('express').Router();

const { login, signup, adminLogin, adminSignup } = require('../Controller/adminController');

router.post('/login', adminLogin);
router.post('/signup', adminSignup);

module.exports = router;

