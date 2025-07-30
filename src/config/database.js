const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.POSTGRES_DB || 'myapp',
  process.env.POSTGRES_USER || 'user',
  process.env.POSTGRES_PASSWORD || 'password',
  {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || '5432',
    dialect: 'postgres',
    logging: false,
    dialectOptions: { connectTimeout: 30000 },
    retry: { match: [/EAI_AGAIN/, /ECONNREFUSED/], max: 5 },
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  }
);

module.exports = sequelize;
