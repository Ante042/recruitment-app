const logger = require('../util/logger');

/**
 * Send a structured JSON error response.
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} errorCode - Application error code
 * @param {string} message - Error message
 * @param {Array|null} [errors=null] - Optional list of detailed errors
 * @returns {Object} Express response
 */
function errorResponse(res, statusCode, errorCode, message, errors = null) {
  const response = {
    error: message,
    errorCode,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
}

/**
 * Global Express error handling middleware.
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {Object} Express response
 */
function errorHandler(err, req, res, next) {
  if (err.isOperational) {
    logger.warn('Operational error:', {
      errorCode: err.errorCode,
      message: err.message,
      path: req.path,
      method: req.method,
      userId: req.user?.id,
    });
  } else {
    logger.error('Programming error:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      userId: req.user?.id,
    });
  }

  if (err.isOperational) {
    return errorResponse(
      res,
      err.statusCode,
      err.errorCode,
      err.message,
      err.errors
    );
  }

  if (err.name && err.name.startsWith('Sequelize')) {
    const { handleDatabaseError } = require('../util/databaseErrorHandler');
    const dbError = handleDatabaseError(err, req.path);
    return errorResponse(
      res,
      dbError.statusCode,
      dbError.errorCode,
      dbError.message
    );
  }

  if (process.env.NODE_ENV === 'production') {
    return errorResponse(res, 500, 'INTERNAL_ERROR', 'An unexpected error occurred');
  } else {
    return errorResponse(res, 500, 'INTERNAL_ERROR', err.message);
  }
}

/**
 * Handle requests to undefined routes.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Express response with 404 status
 */
function notFoundHandler(req, res) {
  logger.debug('404 Not Found:', { path: req.path, method: req.method });
  return errorResponse(res, 404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`);
}

module.exports = { errorHandler, notFoundHandler };
