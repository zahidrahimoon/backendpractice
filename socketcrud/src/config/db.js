import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  'users',      
  'root',     
  'zahid',      
  {
    host: 'localhost',
    dialect: 'mysql', 
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('DB connected successfully');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
