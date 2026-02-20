const express = require('express');

/**
 * Express router for person profile endpoints.
 * @type {import('express').Router}
 */
const router = express.Router();
const PersonController = require('../controller/PersonController');
const { requireAuth } = require('../middleware/auth');

// Get authenticated user's profile with competences and availability
router.get('/me', requireAuth, PersonController.getMyProfile);

module.exports = router;
