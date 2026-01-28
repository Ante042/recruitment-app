const express = require('express');
const AuthController = require('../controller/AuthController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

// Protected routes
router.get('/me', requireAuth, AuthController.getCurrentUser);

module.exports = router;
