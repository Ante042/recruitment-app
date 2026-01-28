const { Application, Person, CompetenceProfile, Competence, Availability } = require('../model');

/**
 * Create a new application
 * @param {number} personId - The person ID
 * @returns {Promise<Application>} The created application
 */
async function createApplication(personId) {
  try {
    return await Application.create({
      personId,
      status: 'unhandled'
    });
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
}

/**
 * Find application by ID
 * @param {number} id - The application ID
 * @param {boolean} includeRelations - Whether to include related data
 * @returns {Promise<Application|null>} The application or null
 */
async function findById(id, includeRelations = false) {
  try {
    const options = { where: { applicationId: id } };

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
 * Find application by person ID
 * @param {number} personId - The person ID
 * @returns {Promise<Application|null>} The application or null
 */
async function findByPersonId(personId) {
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
      ]
    });
  } catch (error) {
    console.error('Error finding application by person ID:', error);
    throw error;
  }
}

/**
 * Find all applications
 * @param {boolean} includeRelations - Whether to include related data
 * @returns {Promise<Application[]>} Array of applications
 */
async function findAll(includeRelations = false) {
  try {
    const options = {};

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
 * Update application status
 * @param {number} id - The application ID
 * @param {string} status - The new status
 * @returns {Promise<Application|null>} The updated application or null
 */
async function updateStatus(id, status) {
  try {
    const application = await Application.findByPk(id);
    if (!application) {
      return null;
    }

    application.status = status;
    await application.save();

    return application;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
}

module.exports = {
  createApplication,
  findById,
  findByPersonId,
  findAll,
  updateStatus
};
