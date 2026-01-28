const ApplicationDAO = require('../integration/ApplicationDAO');
const CompetenceDAO = require('../integration/CompetenceDAO');
const CompetenceProfileDAO = require('../integration/CompetenceProfileDAO');
const AvailabilityDAO = require('../integration/AvailabilityDAO');
const { validateCompetence, validateAvailability, validateStatusUpdate } = require('../util/validation');

/**
 * Add a competence to the applicant's profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function addCompetence(req, res) {
  try {
    const { competenceId, yearsOfExperience } = req.body;

    // Validate input
    const validation = validateCompetence({ competenceId, yearsOfExperience });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Check if competence exists
    const competence = await CompetenceDAO.findById(competenceId);
    if (!competence) {
      return res.status(404).json({ error: 'Competence not found' });
    }

    // Create competence profile
    const profile = await CompetenceProfileDAO.create(
      req.user.id,
      competenceId,
      yearsOfExperience
    );

    res.status(201).json(profile);
  } catch (error) {
    console.error('Error adding competence:', error);
    res.status(500).json({ error: 'Failed to add competence' });
  }
}

/**
 * Add an availability period to the applicant's profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function addAvailability(req, res) {
  try {
    const { fromDate, toDate } = req.body;

    // Validate input
    const validation = validateAvailability({ fromDate, toDate });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Create availability period
    const availability = await AvailabilityDAO.create(
      req.user.id,
      fromDate,
      toDate
    );

    res.status(201).json(availability);
  } catch (error) {
    console.error('Error adding availability:', error);
    res.status(500).json({ error: 'Failed to add availability' });
  }
}

/**
 * Submit an application (applicant only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function submitApplication(req, res) {
  try {
    const personId = req.user.id;

    // Check if applicant already has an application
    const existingApplication = await ApplicationDAO.findByPersonId(personId);
    if (existingApplication) {
      return res.status(409).json({ error: 'Application already submitted' });
    }

    // Verify applicant has at least one competence
    const competences = await CompetenceProfileDAO.findByPersonId(personId);
    if (competences.length === 0) {
      return res.status(400).json({ error: 'At least one competence is required' });
    }

    // Verify applicant has at least one availability period
    const availability = await AvailabilityDAO.findByPersonId(personId);
    if (availability.length === 0) {
      return res.status(400).json({ error: 'At least one availability period is required' });
    }

    // Create application
    const application = await ApplicationDAO.createApplication(personId);

    res.status(201).json({
      applicationId: application.applicationId,
      status: application.status,
      submittedAt: application.submittedAt
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
}

/**
 * Get applicant's own application
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getMyApplication(req, res) {
  try {
    const application = await ApplicationDAO.findByPersonId(req.user.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error getting own application:', error);
    res.status(500).json({ error: 'Failed to get application' });
  }
}

/**
 * List all applications (recruiter only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function listApplications(req, res) {
  try {
    const applications = await ApplicationDAO.findAll(true);
    res.json(applications);
  } catch (error) {
    console.error('Error listing applications:', error);
    res.status(500).json({ error: 'Failed to list applications' });
  }
}

/**
 * Get application details (recruiter only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getApplicationDetails(req, res) {
  try {
    const applicationId = parseInt(req.params.id);

    if (isNaN(applicationId)) {
      return res.status(400).json({ error: 'Invalid application ID' });
    }

    const application = await ApplicationDAO.findById(applicationId, true);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error getting application details:', error);
    res.status(500).json({ error: 'Failed to get application details' });
  }
}

/**
 * Update application status (recruiter only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function updateApplicationStatus(req, res) {
  try {
    const applicationId = parseInt(req.params.id);
    const { status } = req.body;

    if (isNaN(applicationId)) {
      return res.status(400).json({ error: 'Invalid application ID' });
    }

    // Validate status
    const validation = validateStatusUpdate({ status });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Update status
    const application = await ApplicationDAO.updateStatus(applicationId, status);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
}

module.exports = {
  addCompetence,
  addAvailability,
  submitApplication,
  getMyApplication,
  listApplications,
  getApplicationDetails,
  updateApplicationStatus
};
