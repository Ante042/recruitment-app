const { Application, Person, CompetenceProfile, Competence, Availability } = require('../model');
const { isPositiveInteger } = require('../util/validation');

/**
 * Create a new application.
 * @param {number} personId - The person ID
 * @param {Object|null} [transaction=null] - Sequelize transaction
 * @returns {Promise<Application>} The created application
 */
async function createApplication(personId, transaction = null) {
  if (!isPositiveInteger(personId)) throw new Error('personId must be a positive integer');
  try {
    return await Application.create({
      personId,
      status: 'unhandled'
    }, { transaction });
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
}

/**
 * Find application by ID.
 * @param {number} id - The application ID
 * @param {boolean} [includeRelations=false] - Whether to include related data
 * @param {Object|null} [transaction=null] - Sequelize transaction
 * @returns {Promise<Application|null>} The application or null
 */
async function findById(id, includeRelations = false, transaction = null) {
  try {
    const options = { where: { applicationId: id }, transaction };

    if (includeRelations) {
      options.include = [
        {
          model: Person,
          attributes: ['personId', 'firstName', 'lastName', 'email'],
          include: [
            {
              model: CompetenceProfile,
              include: [
                {
                  model: Competence,
                  attributes: ['competenceId', 'name']
                }
              ]
            },
            {
              model: Availability
            }
          ]
        }
      ];
    }

    return await Application.findOne(options);
  } catch (error) {
    console.error('Error finding application by ID:', error);
    throw error;
  }
}

/**
 * Find application by person ID.
 * @param {number} personId - The person ID
 * @param {Object|null} [transaction=null] - Sequelize transaction
 * @returns {Promise<Application|null>} The application or null
 */
async function findByPersonId(personId, transaction = null) {
  try {
    return await Application.findOne({
      where: { personId },
      include: [
        {
          model: Person,
          attributes: ['personId', 'firstName', 'lastName', 'email'],
          include: [
            {
              model: CompetenceProfile,
              include: [
                {
                  model: Competence,
                  attributes: ['competenceId', 'name']
                }
              ]
            },
            {
              model: Availability
            }
          ]
        }
      ],
      transaction
    });
  } catch (error) {
    console.error('Error finding application by person ID:', error);
    throw error;
  }
}

/**
 * Find all applications.
 * @param {boolean} [includeRelations=false] - Whether to include related data
 * @param {Object|null} [transaction=null] - Sequelize transaction
 * @returns {Promise<Application[]>} Array of applications
 */
async function findAll(includeRelations = false, transaction = null) {
  try {
    const options = { transaction };

    if (includeRelations) {
      options.include = [
        {
          model: Person,
          attributes: ['personId', 'firstName', 'lastName', 'email']
        }
      ];
    }

    return await Application.findAll(options);
  } catch (error) {
    console.error('Error finding all applications:', error);
    throw error;
  }
}

/**
 * Update application status.
 * @param {number} id - The application ID
 * @param {string} status - The new status
 * @param {Object|null} [transaction=null] - Sequelize transaction
 * @returns {Promise<Application|null>} The updated application or null
 */
async function updateStatus(id, status, transaction = null) {
  if (!isPositiveInteger(id)) throw new Error('id must be a positive integer');
  const validStatuses = ['unhandled', 'accepted', 'rejected'];
  if (!status || !validStatuses.includes(status)) throw new Error('status must be one of: unhandled, accepted, rejected');
  try {
    const application = await Application.findByPk(id, { transaction });
    if (!application) {
      return null;
    }

    application.status = status;
    await application.save({ transaction });

    return application;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
}

/**
 * Delete application by person ID
 * @param {number} personId - The person ID
 * @param {Object} transaction - Sequelize transaction
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
async function deleteByPersonId(personId, transaction = null) {
  if (!isPositiveInteger(personId)) throw new Error('personId must be a positive integer');
  try {
    const deleted = await Application.destroy({
      where: { personId },
      transaction
    });
    return deleted > 0;
  } catch (error) {
    console.error('Error deleting application by person ID:', error);
    throw error;
  }
}

module.exports = {
  createApplication,
  findById,
  findByPersonId,
  findAll,
  updateStatus,
  deleteByPersonId
};
