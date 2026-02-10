const express = require('express');
const router = express.Router();
const PersonController = require('../controller/PersonController');
const { requireAuth } = require('../middleware/auth');

// Get authenticated user's profile with competences and availability
router.get('/me', requireAuth, PersonController.getMyProfile);

module.exports = router;
