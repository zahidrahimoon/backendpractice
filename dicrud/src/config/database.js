import { Sequelize } from 'sequelize';
import 'dotenv/config';

const defaultConfig = {
  host: 'localhost',
  port: 5432,
  database: 'dicrud',
  username: 'user',
  password: 'pass'
};

let sequelizeConfig;
if (process.env.DATABASE_URL) {
  sequelizeConfig = {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: process.env.SEQUELIZE_LOG === 'true' ? console.log : false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
} else {
  sequelizeConfig = {
    host: defaultConfig.host,
    port: defaultConfig.port,
    database: defaultConfig.database,
    username: defaultConfig.username,
    password: defaultConfig.password,
    dialect: 'postgres',
    logging: process.env.SEQUELIZE_LOG === 'true' ? console.log : false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
}

console.log('Database configuration:', {
  host: sequelizeConfig.host || 'from DATABASE_URL',
  database: sequelizeConfig.database || 'from DATABASE_URL',
  dialect: sequelizeConfig.dialect
});

const sequelize = new Sequelize(sequelizeConfig);

export default sequelize; 