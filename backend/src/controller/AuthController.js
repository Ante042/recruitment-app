const PersonDAO = require('../integration/PersonDAO');
const { hashPassword, comparePassword } = require('../util/password');
const { generateToken } = require('../util/jwt');
const { validateRegistration, validateLogin } = require('../util/validation');

/**
 * Register a new applicant
 */
async function register(req, res) {
  try {
    const { firstName, lastName, email, personNumber, username, password } = req.body;

    // Validate input
    const validation = validateRegistration(req.body);
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Check if username already exists
    const existingUsername = await PersonDAO.findByUsername(username);
    if (existingUsername) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Check if email already exists
    const existingEmail = await PersonDAO.findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create person with applicant role
    const person = await PersonDAO.createPerson({
      firstName,
      lastName,
      email,
      personNumber,
      username,
      passwordHash,
      role: 'applicant'
    });

    res.status(201).json({
      message: 'Account created successfully',
      username: person.username
    });
  } catch (error) {
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

    // Validate input
    const validation = validateLogin(req.body);
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Find user by username
    const person = await PersonDAO.findByUsername(username);
    if (!person) {
      return res.status(401).json({ error: 'Login failed' });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, person.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Login failed' });
    }

    // Generate JWT token
    const token = generateToken({
      userId: person.personId,
      username: person.username,
      role: person.role
    });

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Return user info (without password)
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
