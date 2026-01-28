const express = require('express');
const router = express.Router();
const ApplicationController = require('../controller/ApplicationController');
const { requireAuth, requireRole } = require('../middleware/auth');

// APPLICANT ROUTES
// Build application incrementally
router.post('/competences', requireAuth, requireRole('applicant'), ApplicationController.addCompetence);
router.post('/availability', requireAuth, requireRole('applicant'), ApplicationController.addAvailability);

// Submit application
router.post('/', requireAuth, requireRole('applicant'), ApplicationController.submitApplication);

// Get own application (must come before /:id)
router.get('/me', requireAuth, requireRole('applicant'), ApplicationController.getMyApplication);

// RECRUITER ROUTES
router.get('/', requireAuth, requireRole('recruiter'), ApplicationController.listApplications);
router.get('/:id', requireAuth, requireRole('recruiter'), ApplicationController.getApplicationDetails);
router.patch('/:id/status', requireAuth, requireRole('recruiter'), ApplicationController.updateApplicationStatus);

module.exports = router;
