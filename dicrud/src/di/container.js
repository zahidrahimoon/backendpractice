import fastifyPlugin from 'fastify-plugin';
import { sequelize, initializeDatabase } from '../models/index.js';

async function dbPlugin(fastify) {
  await initializeDatabase();
  
  fastify.decorate('sequelize', sequelize);
  
  fastify.decorate('models', sequelize.models);
}

export default fastifyPlugin(dbPlugin);