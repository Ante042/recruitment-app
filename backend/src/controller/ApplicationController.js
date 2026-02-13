const ApplicationDAO = require('../integration/ApplicationDAO');
const CompetenceDAO = require('../integration/CompetenceDAO');
const CompetenceProfileDAO = require('../integration/CompetenceProfileDAO');
const AvailabilityDAO = require('../integration/AvailabilityDAO');
const { validateCompetence, validateAvailability, validateStatusUpdate } = require('../util/validation');
const sequelize = require('../config/database');

/**
 * Add a competence to the applicant's profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function addCompetence(req, res) {
  try {
    const { competenceId, yearsOfExperience } = req.body;

    const validation = validateCompetence({ competenceId, yearsOfExperience });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const profile = await sequelize.transaction(async (t) => {
      const existingApplication = await ApplicationDAO.findByPersonId(req.user.id, t);
      if (existingApplication && existingApplication.status !== 'unhandled') {
        throw { status: 403, error: `Application is ${existingApplication.status} and cannot be modified.` };
      }

      const competence = await CompetenceDAO.findById(competenceId, t);
      if (!competence) {
        throw { status: 404, error: 'Competence not found' };
      }

      return await CompetenceProfileDAO.create(req.user.id, competenceId, yearsOfExperience, t);
    });

    res.status(201).json(profile);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.error });
    }
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

    const validation = validateAvailability({ fromDate, toDate });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const availability = await sequelize.transaction(async (t) => {
      const existingApplication = await ApplicationDAO.findByPersonId(req.user.id, t);
      if (existingApplication && existingApplication.status !== 'unhandled') {
        throw { status: 403, error: `Application is ${existingApplication.status} and cannot be modified.` };
      }

      return await AvailabilityDAO.create(req.user.id, fromDate, toDate, t);
    });

    res.status(201).json(availability);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.error });
    }
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

    const application = await sequelize.transaction(async (t) => {
      const existingApplication = await ApplicationDAO.findByPersonId(personId, t);
      if (existingApplication) {
        throw { status: 409, error: 'Application already submitted' };
      }

      const competences = await CompetenceProfileDAO.findByPersonId(personId, t);
      if (competences.length === 0) {
        throw { status: 400, error: 'At least one competence is required' };
      }

      const availability = await AvailabilityDAO.findByPersonId(personId, t);
      if (availability.length === 0) {
        throw { status: 400, error: 'At least one availability period is required' };
      }

      return await ApplicationDAO.createApplication(personId, t);
    });

    res.status(201).json({
      applicationId: application.applicationId,
      status: application.status,
      submittedAt: application.submittedAt
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.error });
    }
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
    const application = await sequelize.transaction(async (t) => {
      return await ApplicationDAO.findByPersonId(req.user.id, t);
    });

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
    const applications = await sequelize.transaction(async (t) => {
      return await ApplicationDAO.findAll(true, t);
    });
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

    const application = await sequelize.transaction(async (t) => {
      return await ApplicationDAO.findById(applicationId, true, t);
    });

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

    const validation = validateStatusUpdate({ status });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const application = await sequelize.transaction(async (t) => {
      const result = await ApplicationDAO.updateStatus(applicationId, status, t);
      if (!result) {
        throw { status: 404, error: 'Application not found' };
      }
      return result;
    });

    res.json(application);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.error });
    }
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
}

/**
 * Get all available competences for dropdown
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getAllCompetences(req, res) {
  try {
    const competences = await sequelize.transaction(async (t) => {
      return await CompetenceDAO.findAll(t);
    });
    res.json(competences);
  } catch (error) {
    console.error('Error getting all competences:', error);
    res.status(500).json({ error: 'Failed to get competences' });
  }
}

/**
 * Delete a competence profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteCompetence(req, res) {
  try {
    const competenceProfileId = parseInt(req.params.id);
    if (isNaN(competenceProfileId)) {
      return res.status(400).json({ error: 'Invalid competence profile ID' });
    }

    const deleted = await sequelize.transaction(async (t) => {
      return await CompetenceProfileDAO.deleteById(competenceProfileId, req.user.id, t);
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Competence profile not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting competence:', error);
    res.status(500).json({ error: 'Failed to delete competence' });
  }
}

/**
 * Delete an availability period
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteAvailability(req, res) {
  try {
    const availabilityId = parseInt(req.params.id);
    if (isNaN(availabilityId)) {
      return res.status(400).json({ error: 'Invalid availability ID' });
    }

    const deleted = await sequelize.transaction(async (t) => {
      return await AvailabilityDAO.deleteById(availabilityId, req.user.id, t);
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Availability period not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting availability:', error);
    res.status(500).json({ error: 'Failed to delete availability' });
  }
}

module.exports = {
  addCompetence,
  addAvailability,
  submitApplication,
  getMyApplication,
  listApplications,
  getApplicationDetails,
  updateApplicationStatus,
  getAllCompetences,
  deleteCompetence,
  deleteAvailability
};
