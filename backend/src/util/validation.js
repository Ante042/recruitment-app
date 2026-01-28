/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} True if email is valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Swedish person number format (YYYYMMDD-XXXX)
 * @param {string} pnr - The person number to validate
 * @returns {boolean} True if format is valid
 */
function isValidPersonNumber(pnr) {
  const pnrRegex = /^\d{8}-\d{4}$/;
  return pnrRegex.test(pnr);
}

/**
 * Validate registration data
 * @param {Object} data - The registration data
 * @returns {Object} { valid: boolean, errors: Array<string> }
 */
function validateRegistration(data) {
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
    errors.push('Person number is required');
  } else if (!isValidPersonNumber(data.personNumber)) {
    errors.push('Invalid person number format (expected: YYYYMMDD-XXXX)');
  }

  if (!data.username || data.username.trim() === '') {
    errors.push('Username is required');
  }

  if (!data.password || data.password.trim() === '') {
    errors.push('Password is required');
  } else if (data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate login data
 * @param {Object} data - The login data
 * @returns {Object} { valid: boolean, errors: Array<string> }
 */
function validateLogin(data) {
  const errors = [];

  if (!data.username || data.username.trim() === '') {
    errors.push('Username is required');
  }

  if (!data.password || data.password.trim() === '') {
    errors.push('Password is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  isValidEmail,
  isValidPersonNumber,
  validateRegistration,
  validateLogin
};
