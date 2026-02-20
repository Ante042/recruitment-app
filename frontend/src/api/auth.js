import client from './client';

/**
 * Register a new user account.
 * @param {Object} data - Registration data (firstName, lastName, email, personNumber, username, password)
 * @returns {Promise<Object>} The created user data
 */
export const registerUser = async (data) => {
  const response = await client.post('/auth/register', data);
  return response.data;
};

/**
 * Login with username and password.
 * @param {Object} credentials - Login credentials (username, password)
 * @returns {Promise<Object>} The authenticated user data
 */
export const loginUser = async (credentials) => {
  const response = await client.post('/auth/login', credentials);
  return response.data;
};

/**
 * Logout the current user.
 * @returns {Promise<Object>} Logout confirmation
 */
export const logoutUser = async () => {
  const response = await client.post('/auth/logout');
  return response.data;
};

/**
 * Get the currently authenticated user.
 * @returns {Promise<Object>} The current user data
 */
export const getCurrentUser = async () => {
  const response = await client.get('/auth/me');
  return response.data;
};
