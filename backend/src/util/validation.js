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

/**
 * Validate competence data
 * @param {Object} data - The competence data
 * @returns {Object} { valid: boolean, errors: Array<string> }
 */
function validateCompetence(data) {
  const errors = [];

  if (!data.competenceId) {
    errors.push('Competence ID is required');
  } else if (typeof data.competenceId !== 'number' || data.competenceId <= 0) {
    errors.push('Competence ID must be a positive number');
  }

  if (data.yearsOfExperience === undefined || data.yearsOfExperience === null) {
    errors.push('Years of experience is required');
  } else if (typeof data.yearsOfExperience !== 'number' || data.yearsOfExperience < 0) {
    errors.push('Years of experience must be a non-negative number');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate availability data
 * @param {Object} data - The availability data
 * @returns {Object} { valid: boolean, errors: Array<string> }
 */
function validateAvailability(data) {
  const errors = [];

  if (!data.fromDate || data.fromDate.trim() === '') {
    errors.push('From date is required');
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.fromDate)) {
      errors.push('From date must be in YYYY-MM-DD format');
    }
  }

  if (!data.toDate || data.toDate.trim() === '') {
    errors.push('To date is required');
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.toDate)) {
      errors.push('To date must be in YYYY-MM-DD format');
    }
  }

  if (data.fromDate && data.toDate) {
    const from = new Date(data.fromDate);
    const to = new Date(data.toDate);
    if (to < from) {
      errors.push('To date must be equal to or after from date');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate status update data
 * @param {Object} data - The status data
 * @returns {Object} { valid: boolean, errors: Array<string> }
 */
function validateStatusUpdate(data) {
  const errors = [];
  const validStatuses = ['unhandled', 'accepted', 'rejected'];

  if (!data.status || data.status.trim() === '') {
    errors.push('Status is required');
  } else if (!validStatuses.includes(data.status)) {
    errors.push('Status must be one of: unhandled, accepted, rejected');
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
  validateLogin,
  validateCompetence,
  validateAvailability,
  validateStatusUpdate
};
