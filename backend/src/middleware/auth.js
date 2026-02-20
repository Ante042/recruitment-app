const { verifyToken } = require('../util/jwt');
const PersonDAO = require('../integration/PersonDAO');
const { UnauthorizedError, TokenExpiredError, TokenMalformedError, ForbiddenError } = require('../util/errors');

/**
 * Middleware to require authentication
 * Extracts JWT from cookie, verifies it, and attaches user to req.user
 */
async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const decoded = verifyToken(token);

    const person = await PersonDAO.findById(decoded.userId);
    if (!person) {
      throw new UnauthorizedError('User not found');
    }

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
    if (error.name === 'TokenExpiredError') {
      next(new TokenExpiredError());
    } else if (error.name === 'JsonWebTokenError') {
      next(new TokenMalformedError());
    } else {
      next(error);
    }
  }
}

/**
 * Middleware to require specific role
 * @param {string} role - The required role
 */
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (req.user.role !== role) {
      return next(new ForbiddenError());
    }

    next();
  };
}

module.exports = {
  requireAuth,
  requireRole
};
