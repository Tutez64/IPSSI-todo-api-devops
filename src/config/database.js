const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST || 'postgres',
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      connectTimeout: 30000,
    },
    retry: {
      match: [/ECONNREFUSED/],
      max: 5,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
