const PersonDAO = require('../integration/PersonDAO');
const { hashPassword, comparePassword } = require('../util/password');
const { generateToken } = require('../util/jwt');
const { validateRegistration, validateLogin } = require('../util/validation');
const sequelize = require('../config/database');

/**
 * Register a new applicant
 */
async function register(req, res) {
  try {
    const { firstName, lastName, email, personNumber, username, password } = req.body;

    const validation = validateRegistration(req.body);
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const passwordHash = await hashPassword(password);

    const person = await sequelize.transaction(async (t) => {
      const existingUsername = await PersonDAO.findByUsername(username, t);
      if (existingUsername) {
        throw { status: 409, error: 'Username already exists' };
      }

      const existingEmail = await PersonDAO.findByEmail(email, t);
      if (existingEmail) {
        throw { status: 409, error: 'Email already exists' };
      }

      return await PersonDAO.createPerson({
        firstName, lastName, email, personNumber, username, passwordHash, role: 'applicant'
      }, t);
    });

    res.status(201).json({
      message: 'Account created successfully',
      username: person.username
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.error });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}

/**
 * Login user (applicant or recruiter)
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;

    const validation = validateLogin(req.body);
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const person = await sequelize.transaction(async (t) => {
      return await PersonDAO.findByUsername(username, t);
    });

    if (!person) {
      return res.status(401).json({ error: 'Login failed' });
    }

    const isPasswordValid = await comparePassword(password, person.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Login failed' });
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
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}

/**
 * Logout user
 */
function logout(req, res) {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 0
  });
  res.status(200).json({ message: 'Logged out successfully' });
}

/**
 * Get current authenticated user
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
