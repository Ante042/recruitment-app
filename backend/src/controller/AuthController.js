const PersonDAO = require('../integration/PersonDAO');
const { hashPassword, comparePassword } = require('../util/password');
const { generateToken } = require('../util/jwt');
const { validateRegistration, validateLogin } = require('../util/validation');
const { ValidationError, ConflictError, UnauthorizedError } = require('../util/errors');
const { handleDatabaseError } = require('../util/databaseErrorHandler');
const logger = require('../util/logger');
const sequelize = require('../config/database');

/**
 * Register a new applicant.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {void}
 */
async function register(req, res, next) {
  try {
    const { firstName, lastName, email, personNumber, username, password } = req.body;

    const validation = validateRegistration(req.body);
    if (!validation.valid) {
      throw new ValidationError('Validation failed', validation.errors);
    }

    const passwordHash = await hashPassword(password);

    const person = await sequelize.transaction(async (t) => {
      const existingUsername = await PersonDAO.findByUsername(username, t);
      if (existingUsername) {
        throw new ConflictError('Username already exists');
      }

      const existingEmail = await PersonDAO.findByEmail(email, t);
      if (existingEmail) {
        throw new ConflictError('Email already exists');
      }

      return await PersonDAO.createPerson({
        firstName, lastName, email, personNumber, username, passwordHash, role: 'applicant'
      }, t);
    });

    logger.info('User registered successfully', { username: person.username });

    res.status(201).json({
      message: 'Account created successfully',
      username: person.username
    });
  } catch (error) {
    if (error.name && error.name.startsWith('Sequelize')) {
      next(handleDatabaseError(error, 'register'));
    } else {
      next(error);
    }
  }
}

/**
 * Login user (applicant or recruiter).
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {void}
 */
async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    const validation = validateLogin(req.body);
    if (!validation.valid) {
      throw new ValidationError('Validation failed', validation.errors);
    }

    const person = await PersonDAO.findByUsername(username);

    if (!person) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(password, person.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = generateToken({
      userId: person.personId,
      username: person.username,
      role: person.role
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    logger.info('User logged in', { username: person.username });

    res.status(200).json({
      user: {
        id: person.personId,
        username: person.username,
        firstName: person.firstName,
        lastName: person.lastName,
        role: person.role
      }
    });
  } catch (error) {
    if (error.name && error.name.startsWith('Sequelize')) {
      next(handleDatabaseError(error, 'login'));
    } else {
      next(error);
    }
  }
}

/**
 * Logout user by clearing the auth cookie.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
function logout(req, res) {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 0
  });

  logger.info('User logged out', { userId: req.user?.id });

  res.status(200).json({ message: 'Logged out successfully' });
}

/**
 * Get current authenticated user from the request.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
function getCurrentUser(req, res) {
  res.status(200).json({ user: req.user });
}

module.exports = {
  register,
  login,
  logout,
  getCurrentUser
};
