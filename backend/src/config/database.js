const { Sequelize } = require('sequelize');

/**
 * Sequelize instance configured for PostgreSQL.
 * @type {Sequelize}
 */
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
      evict: 5000,
    },
    retry: {
      max: 2,
    },
  }
);

module.exports = sequelize;
