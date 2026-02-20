import client from './client';

/**
 * Fetch all available competences.
 * @returns {Promise<Object>} List of competences
 */
export const getCompetences = async () => {
  const response = await client.get('/applications/competences');
  return response.data;
};

/**
 * Fetch the current user's profile.
 * @returns {Promise<Object>} The user profile data
 */
export const getMyProfile = async () => {
  const response = await client.get('/person/me');
  return response.data;
};

/**
 * Fetch the current user's application.
 * @returns {Promise<Object>} The application data
 */
export const getMyApplication = async () => {
  const response = await client.get('/applications/me');
  return response.data;
};

/**
 * Add a competence to the current user's profile.
 * @param {Object} data - Competence data (competenceId, yearsOfExperience)
 * @returns {Promise<Object>} The created competence profile
 */
export const addCompetence = async (data) => {
  const response = await client.post('/applications/competences', data);
  return response.data;
};

/**
 * Delete a competence from the current user's profile.
 * @param {number} competenceProfileId - The competence profile ID to delete
 * @returns {Promise<void>}
 */
export const deleteCompetence = async (competenceProfileId) => {
  await client.delete(`/applications/competences/${competenceProfileId}`);
};

/**
 * Add an availability period to the current user's profile.
 * @param {Object} data - Availability data (fromDate, toDate)
 * @returns {Promise<Object>} The created availability period
 */
export const addAvailability = async (data) => {
  const response = await client.post('/applications/availability', data);
  return response.data;
};

/**
 * Delete an availability period from the current user's profile.
 * @param {number} availabilityId - The availability ID to delete
 * @returns {Promise<void>}
 */
export const deleteAvailability = async (availabilityId) => {
  await client.delete(`/applications/availability/${availabilityId}`);
};

/**
 * Submit the current user's application.
 * @returns {Promise<Object>} The submitted application data
 */
export const submitApplication = async () => {
  const response = await client.post('/applications');
  return response.data;
};

/**
 * Delete the current user's application.
 * @returns {Promise<void>}
 */
export const deleteMyApplication = async () => {
  await client.delete('/applications/me');
};

/**
 * Fetch all applications (recruiter only).
 * @returns {Promise<Object>} List of applications
 */
export const getApplications = async () => {
  const response = await client.get('/applications');
  return response.data;
};

/**
 * Fetch a specific application by ID (recruiter only).
 * @param {number} id - The application ID
 * @returns {Promise<Object>} The application details
 */
export const getApplicationById = async (id) => {
  const response = await client.get(`/applications/${id}`);
  return response.data;
};

/**
 * Update the status of an application (recruiter only).
 * @param {number} id - The application ID
 * @param {string} status - The new status (accepted/rejected)
 * @returns {Promise<Object>} The updated application
 */
export const updateApplicationStatus = async (id, status) => {
  const response = await client.patch(`/applications/${id}/status`, { status });
  return response.data;
};
