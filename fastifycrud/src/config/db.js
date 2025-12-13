import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  'users',
  'zahid',
  'zahid',
  {
    host: 'mypg',
    dialect: 'postgres',
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('DB connected successfully');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
