const express = require('express');
const {
  ValidationError,
  NotFoundError,
  DatabaseError,
  UnauthorizedError,
} = require('../util/errors');

const router = express.Router();

router.get('/error/validation', (req, res, next) => {
  next(new ValidationError('Test validation error', ['Field 1 is invalid', 'Field 2 is required']));
});

router.get('/error/not-found', (req, res, next) => {
  next(new NotFoundError('Test Resource'));
});

router.get('/error/database', (req, res, next) => {
  next(new DatabaseError('Test database error', new Error('Connection timeout')));
});

router.get('/error/unauthorized', (req, res, next) => {
  next(new UnauthorizedError());
});

router.get('/error/unhandled', (req, res, next) => {
  throw new Error('Test unhandled error');
});

router.get('/error/db-unreachable', async (req, res, next) => {
  const sequelize = require('../config/database');
  try {
    await sequelize.query('SELECT * FROM nonexistent_table');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
