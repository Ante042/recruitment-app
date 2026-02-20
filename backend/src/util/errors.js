/**
 * Custom error classes for structured error handling.
 */

/**
 * Base application error with HTTP status and error code.
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {string} errorCode - Application error code
 */
class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error (400) with optional field-level errors.
 * @param {string} message - Error message
 * @param {Array<string>} [errors=[]] - List of validation errors
 */
class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

/**
 * Conflict error (409) for duplicate resources.
 * @param {string} message - Error message
 */
class ConflictError extends AppError {
  constructor(message) {
    super(message, 409, 'CONFLICT');
  }
}

/**
 * Not found error (404) for missing resources.
 * @param {string} [resource='Resource'] - Name of the missing resource
 */
class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

/**
 * Unauthorized error (401) for unauthenticated requests.
 * @param {string} [message='Not authenticated'] - Error message
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Not authenticated') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

/**
 * Forbidden error (403) for insufficient permissions.
 * @param {string} [message='Access denied'] - Error message
 */
class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'FORBIDDEN');
  }
}

/**
 * Database error (500) wrapping the original Sequelize error.
 * @param {string} message - Error message
 * @param {Error} originalError - The original database error
 */
class DatabaseError extends AppError {
  constructor(message, originalError) {
    super(message, 500, 'DATABASE_ERROR');
    this.originalError = originalError;
  }
}

/**
 * Token expired error (401) for expired JWT tokens.
 */
class TokenExpiredError extends AppError {
  constructor() {
    super('Token expired', 401, 'TOKEN_EXPIRED');
  }
}

/**
 * Token malformed error (401) for invalid JWT tokens.
 */
class TokenMalformedError extends AppError {
  constructor() {
    super('Invalid token', 401, 'TOKEN_MALFORMED');
  }
}

module.exports = {
  AppError,
  ValidationError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  DatabaseError,
  TokenExpiredError,
  TokenMalformedError
};
