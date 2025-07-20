import {  Sequelize } from 'sequelize';
import { sequelize } from '../config/db.js';


export const User = sequelize.define('User', {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
  });
  
