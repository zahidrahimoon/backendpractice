import 'dotenv/config';
import fastify from "fastify";
import dbPlugin from './di/container.js';
import userController from './controllers/userController.js';

const server = fastify({
  logger: true
});

server.register(dbPlugin);
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Using default config'
});

server.register(userController, { prefix: '/api' });

server.get("/", async (req, reply) => {
  return { 
    message: "Welcome to DI-CRUD API", 
    version: "1.0.0",
    endpoints: {
      users: "/api/users"
    }
  };
});

server.setErrorHandler((error, reply) => {
  server.log.error(error);
  
  if (error.validation) {
    return reply.status(400).send({
      error: 'Validation Error',
      details: error.validation
    });
  }
  
  return reply.status(500).send({
    error: 'Internal Server Error',
    message: error.message
  });
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server is running on http://localhost:3000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();