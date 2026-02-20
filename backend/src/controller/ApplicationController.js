const ApplicationDAO = require('../integration/ApplicationDAO');
const CompetenceDAO = require('../integration/CompetenceDAO');
const CompetenceProfileDAO = require('../integration/CompetenceProfileDAO');
const AvailabilityDAO = require('../integration/AvailabilityDAO');
const { validateCompetence, validateAvailability, validateStatusUpdate } = require('../util/validation');
const sequelize = require('../config/database');
const { ValidationError, NotFoundError, ForbiddenError } = require('../util/errors');
const { handleDatabaseError } = require('../util/databaseErrorHandler');
const logger = require('../util/logger');

/**
 * Add a competence to the applicant's profile.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {void}
 */
async function addCompetence(req, res, next) {
  try {
    const { competenceId, yearsOfExperience } = req.body;

    const validation = validateCompetence({ competenceId, yearsOfExperience });
    if (!validation.valid) {
      throw new ValidationError('Validation failed', validation.errors);
    }

    const profile = await sequelize.transaction(async (t) => {
      const existingApplication = await ApplicationDAO.findByPersonId(req.user.id, t);
      if (existingApplication && existingApplication.status !== 'unhandled') {
        throw new ForbiddenError(`Application is ${existingApplication.status} and cannot be modified.`);
      }

      const competence = await CompetenceDAO.findById(competenceId, t);
      if (!competence) {
        throw new NotFoundError('Competence');
      }

      return await CompetenceProfileDAO.create(req.user.id, competenceId, yearsOfExperience, t);
    });

    logger.info(`Competence ${competenceId} added for user ${req.user.id}`);
    res.status(201).json(profile);
  } catch (error) {
    if (error.name && error.name.startsWith('Sequelize')) {
      next(handleDatabaseError(error, 'addCompetence'));
    } else {
      next(error);
    }
  }
}

/**
 * Add an availability period to the applicant's profile.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {void}
 */
async function addAvailability(req, res, next) {
  try {
    const { fromDate, toDate } = req.body;

    const validation = validateAvailability({ fromDate, toDate });
    if (!validation.valid) {
      throw new ValidationError('Validation failed', validation.errors);
    }

    const availability = await sequelize.transaction(async (t) => {
      const existingApplication = await ApplicationDAO.findByPersonId(req.user.id, t);
      if (existingApplication && existingApplication.status !== 'unhandled') {
        throw new ForbiddenError(`Application is ${existingApplication.status} and cannot be modified.`);
      }

      return await AvailabilityDAO.create(req.user.id, fromDate, toDate, t);
    });

    logger.info(`Availability added for user ${req.user.id}`);
    res.status(201).json(availability);
  } catch (error) {
    if (error.name && error.name.startsWith('Sequelize')) {
      next(handleDatabaseError(error, 'addAvailability'));
    } else {
      next(error);
    }
  }
}

/**
 * Submit an application (applicant only).
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {void}
 */
async function submitApplication(req, res, next) {
  try {
    const personId = req.user.id;

    const application = await sequelize.transaction(async (t) => {
      const existingApplication = await ApplicationDAO.findByPersonId(personId, t);
      if (existingApplication) {
        throw new ValidationError('Application already submitted', [{ field: 'application', message: 'Application already submitted' }]);
      }

      const competences = await CompetenceProfileDAO.findByPersonId(personId, t);
      if (competences.length === 0) {
        throw new ValidationError('At least one competence is required', [{ field: 'competences', message: 'At least one competence is required' }]);
      }

      const availability = await AvailabilityDAO.findByPersonId(personId, t);
      if (availability.length === 0) {
        throw new ValidationError('At least one availability period is required', [{ field: 'availability', message: 'At least one availability period is required' }]);
      }

      return await ApplicationDAO.createApplication(personId, t);
    });

    logger.info(`Application submitted for user ${personId}`);
    res.status(201).json({
      applicationId: application.applicationId,
      status: application.status,
      submittedAt: application.submittedAt
    });
  } catch (error) {
    if (error.name && error.name.startsWith('Sequelize')) {
      next(handleDatabaseError(error, 'submitApplication'));
    } else {
      next(error);
    }
  }
}

/**
 * Get applicant's own application.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {void}
 */
async function getMyApplication(req, res, next) {
  try {
    const application = await sequelize.transaction(async (t) => {
      return await ApplicationDAO.findByPersonId(req.user.id, t);
    });

    if (!application) {
      throw new NotFoundError('Application');
    }

    res.json(application);
  } catch (error) {
    if (error.name && error.name.startsWith('Sequelize')) {
      next(handleDatabaseError(error, 'getMyApplication'));
    } else {
      next(error);
    }
  }
}

/**
 * List all applications (recruiter only).
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {void}
 */
async function listApplications(req, res, next) {
  try {
    const applications = await sequelize.transaction(async (t) => {
      return await ApplicationDAO.findAll(true, t);
    });
    res.json(applications);
  } catch (error) {
    if (error.name && error.name.startsWith('Sequelize')) {
      next(handleDatabaseError(error, 'listApplications'));
    } else {
      next(error);
    }
  }
}

/**
 * Get application details (recruiter only).
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {void}
 */
async function getApplicationDetails(req, res, next) {
  try {
    const applicationId = parseInt(req.params.id);
    if (isNaN(applicationId)) {
      throw new ValidationError('Invalid application ID', [{ field: 'id', message: 'Invalid application ID' }]);
    }

    const application = await sequelize.transaction(async (t) => {
      return await ApplicationDAO.findById(applicationId, true, t);
    });

    if (!application) {
      throw new NotFoundError('Application');
    }

    res.json(application);
  } catch (error) {
    if (error.name && error.name.startsWith('Sequelize')) {
      next(handleDatabaseError(error, 'getApplicationDetails'));
    } else {
      next(error);
    }
  }
}

/**
 * Update application status (recruiter only).
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {void}
 */
async function updateApplicationStatus(req, res, next) {
  try {
    const applicationId = parseInt(req.params.id);
    const { status } = req.body;

    if (isNaN(applicationId)) {
      throw new ValidationError('Invalid application ID', [{ field: 'id', message: 'Invalid application ID' }]);
    }

    const validation = validateStatusUpdate({ status });
    if (!validation.valid) {
      throw new ValidationError('Validation failed', validation.errors);
    }

    const application = await sequelize.transaction(async (t) => {
      const result = await ApplicationDAO.updateStatus(applicationId, status, t);
      if (!result) {
        throw new NotFoundError('Application');
      }
      return result;
    });

    logger.info(`Application ${applicationId} status updated to ${status}`);
    res.json(application);
  } catch (error) {
    if (error.name && error.name.startsWith('Sequelize')) {
      next(handleDatabaseError(error, 'updateApplicationStatus'));
    } else {
      next(error);
    }
  }
}

/**
 * Get all available competences for dropdown.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {void}
 */
async function getAllCompetences(req, res, next) {
  try {
    const competences = await sequelize.transaction(async (t) => {
      return await CompetenceDAO.findAll(t);
    });
    res.json(competences);
  } catch (error) {
    if (error.name && error.name.startsWith('Sequelize')) {
      next(handleDatabaseError(error, 'getAllCompetences'));
    } else {
      next(error);
    }
  }
}

/**
 * Delete a competence profile.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {void}
 */
async function deleteCompetence(req, res, next) {
  try {
    const competenceProfileId = parseInt(req.params.id);
    if (isNaN(competenceProfileId)) {
      throw new ValidationError('Invalid competence profile ID', [{ field: 'id', message: 'Invalid competence profile ID' }]);
    }

    const deleted = await sequelize.transaction(async (t) => {
      return await CompetenceProfileDAO.deleteById(competenceProfileId, req.user.id, t);
    });

    if (!deleted) {
      throw new NotFoundError('Competence profile');
    }

    logger.info(`Competence profile ${competenceProfileId} deleted for user ${req.user.id}`);
    res.status(204).send();
  } catch (error) {
    if (error.name && error.name.startsWith('Sequelize')) {
      next(handleDatabaseError(error, 'deleteCompetence'));
    } else {
      next(error);
    }
  }
}

/**
 * Delete an availability period.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {void}
 */
async function deleteAvailability(req, res, next) {
  try {
    const availabilityId = parseInt(req.params.id);
    if (isNaN(availabilityId)) {
      throw new ValidationError('Invalid availability ID', [{ field: 'id', message: 'Invalid availability ID' }]);
    }

    const deleted = await sequelize.transaction(async (t) => {
      return await AvailabilityDAO.deleteById(availabilityId, req.user.id, t);
    });

    if (!deleted) {
      throw new NotFoundError('Availability period');
    }

    logger.info(`Availability ${availabilityId} deleted for user ${req.user.id}`);
    res.status(204).send();
  } catch (error) {
    if (error.name && error.name.startsWith('Sequelize')) {
      next(handleDatabaseError(error, 'deleteAvailability'));
    } else {
      next(error);
    }
  }
}

/**
 * Delete own application and all related profile data.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {void}
 */
async function deleteApplication(req, res, next) {
  try {
    const personId = req.user.id;

    await sequelize.transaction(async (t) => {
      const application = await ApplicationDAO.findByPersonId(personId, t);
      if (!application) {
        throw new NotFoundError('Application');
      }

      if (application.status === 'accepted') {
        throw new ForbiddenError('Cannot delete an accepted application.');
      }

      await CompetenceProfileDAO.deleteAllByPersonId(personId, t);
      await AvailabilityDAO.deleteAllByPersonId(personId, t);
      await ApplicationDAO.deleteByPersonId(personId, t);
    });

    logger.info(`Application deleted for user ${personId}`);
    res.status(204).send();
  } catch (error) {
    if (error.name && error.name.startsWith('Sequelize')) {
      next(handleDatabaseError(error, 'deleteApplication'));
    } else {
      next(error);
    }
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
  deleteAvailability,
  deleteApplication
};
