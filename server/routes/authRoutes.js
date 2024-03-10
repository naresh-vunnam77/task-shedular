const express = require('express');

const {
  register,
  login,
  logout,
} = require('../controllers/authController');

// initiate express router
const router = express.Router();

// add middleware

// set routes
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);

module.exports = router;
