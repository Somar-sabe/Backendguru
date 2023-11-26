//authRoute.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for user registration
router.post('/register', authController.register);

// Route for user login
router.post('/login', authController.login);

// Route for initiating the forget password process
router.post('/forget-password', authController.forgetPassword);

// Route for resetting password using the reset token
router.post('/reset-password', authController.resetPassword);

module.exports = router;
