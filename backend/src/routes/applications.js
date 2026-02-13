const express = require('express');
const router = express.Router();
const ApplicationController = require('../controller/ApplicationController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { requireUnhandledApplication } = require('../middleware/applicationGuard');

// APPLICANT ROUTES
// Get all competences for dropdown (accessible to all authenticated users)
router.get('/competences', requireAuth, ApplicationController.getAllCompetences);

// Build application incrementally
router.post('/competences', requireAuth, requireRole('applicant'), ApplicationController.addCompetence);
router.post('/availability', requireAuth, requireRole('applicant'), ApplicationController.addAvailability);

// Delete competence (only if application unhandled)
router.delete('/competences/:id', requireAuth, requireRole('applicant'), requireUnhandledApplication, ApplicationController.deleteCompetence);

// Delete availability (only if application unhandled)
router.delete('/availability/:id', requireAuth, requireRole('applicant'), requireUnhandledApplication, ApplicationController.deleteAvailability);

// Submit application
router.post('/', requireAuth, requireRole('applicant'), ApplicationController.submitApplication);

// Get own application (must come before /:id)
router.get('/me', requireAuth, requireRole('applicant'), ApplicationController.getMyApplication);

// Delete own application (full reset)
router.delete('/me', requireAuth, requireRole('applicant'), ApplicationController.deleteApplication);

// RECRUITER ROUTES
router.get('/', requireAuth, requireRole('recruiter'), ApplicationController.listApplications);
router.get('/:id', requireAuth, requireRole('recruiter'), ApplicationController.getApplicationDetails);
router.patch('/:id/status', requireAuth, requireRole('recruiter'), ApplicationController.updateApplicationStatus);

module.exports = router;
