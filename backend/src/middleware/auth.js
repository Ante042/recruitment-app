const { verifyToken } = require('../util/jwt');
const PersonDAO = require('../integration/PersonDAO');

/**
 * Middleware to require authentication
 * Extracts JWT from cookie, verifies it, and attaches user to req.user
 */
async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const person = await PersonDAO.findById(decoded.userId);
    if (!person) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user to request
    req.user = {
      id: person.personId,
      username: person.username,
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email,
      role: person.role
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Middleware to require specific role
 * @param {string} role - The required role
 */
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
}

module.exports = {
  requireAuth,
  requireRole
};
