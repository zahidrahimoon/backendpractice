import sequelize from '../config/database.js';
import User from './User.js';

const models = {
  User
};

export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables synchronized successfully.');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

export { sequelize };
export default models; 