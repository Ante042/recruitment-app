/**
 * Validate email format.
 * @param {string} email - The email to validate
 * @returns {boolean} True if the email format is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Swedish personal number format (YYYYMMDD-XXXX).
 * @param {string} pnr - The personal number to validate
 * @returns {boolean} True if the format is valid
 */
export const isValidPersonNumber = (pnr) => {
  const pnrRegex = /^\d{8}-\d{4}$/;
  return pnrRegex.test(pnr);
};

/**
 * Validate registration form data.
 * @param {Object} data - The form data to validate
 * @returns {Array<string>} Array of error messages, empty if valid
 */
export const validateRegistrationForm = (data) => {
  const errors = [];

  if (!data.firstName || data.firstName.trim() === '') {
    errors.push('First name is required');
  }

  if (!data.lastName || data.lastName.trim() === '') {
    errors.push('Last name is required');
  }

  if (!data.email || data.email.trim() === '') {
    errors.push('Email is required');
  } else if (!isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }

  if (!data.personNumber || data.personNumber.trim() === '') {
    errors.push('Personal number is required');
  } else if (!isValidPersonNumber(data.personNumber)) {
    errors.push('Personal number must be in format YYYYMMDD-XXXX');
  }

  if (!data.username || data.username.trim() === '') {
    errors.push('Username is required');
  }

  if (!data.password || data.password.trim() === '') {
    errors.push('Password is required');
  } else if (data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  return errors;
};

/**
 * Validate login form data.
 * @param {Object} data - The form data to validate
 * @returns {Array<string>} Array of error messages, empty if valid
 */
export const validateLoginForm = (data) => {
  const errors = [];

  if (!data.username || data.username.trim() === '') {
    errors.push('Username is required');
  }

  if (!data.password || data.password.trim() === '') {
    errors.push('Password is required');
  }

  return errors;
};
