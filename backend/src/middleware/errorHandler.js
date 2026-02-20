const logger = require('../util/logger');

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

function notFoundHandler(req, res) {
  logger.debug('404 Not Found:', { path: req.path, method: req.method });
  return errorResponse(res, 404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`);
}

module.exports = { errorHandler, notFoundHandler };
