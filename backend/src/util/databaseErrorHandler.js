const { DatabaseError, ConflictError, ValidationError } = require('./errors');
const logger = require('./logger');

function handleDatabaseError(error, context = '') {
  logger.error(`Database error in ${context}:`, {
    name: error.name,
    message: error.message,
    code: error.original?.code,
    constraint: error.original?.constraint,
  });

  if (error.name === 'SequelizeUniqueConstraintError') {
    const field = error.errors[0]?.path;
    return new ConflictError(`${field} already exists`);
  }

  if (error.name === 'SequelizeValidationError') {
    const errors = error.errors.map(e => e.message);
    return new ValidationError('Validation failed', errors);
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return new ValidationError('Invalid reference');
  }

  if (error.name === 'SequelizeConnectionError') {
    return new DatabaseError('Database connection failed', error);
  }

  if (error.name === 'SequelizeTimeoutError') {
    return new DatabaseError('Database operation timed out', error);
  }

  return new DatabaseError('Database operation failed', error);
}

module.exports = { handleDatabaseError };
