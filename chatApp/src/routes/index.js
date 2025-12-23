// Basic routes for the chat application

export default async function routes(fastify, options) {
  // Health check / root route
  fastify.get('/', async (request, reply) => {
    return { 
      status: 'ok',
      message: 'Welcome to ChatApp API',
      timestamp: new Date().toISOString()
    };
  });

  // Health check endpoint
  fastify.get('/health', async (request, reply) => {
    return { 
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  });

  // API info endpoint
  fastify.get('/api', async (request, reply) => {
    return {
      name: 'ChatApp API',
      version: '1.0.0',
      endpoints: {
        root: 'GET /',
        health: 'GET /health',
        api: 'GET /api',
        dbCheck: 'GET /api/db-check'
      }
    };
  });

  // Database connection check
  fastify.get('/api/db-check', async (request, reply) => {
    try {
      const { query } = await import('../db/index.js');
      const result = await query('SELECT NOW() as current_time');
      return {
        status: 'connected',
        database_time: result.rows[0].current_time
      };
    } catch (error) {
      reply.status(500);
      return {
        status: 'error',
        message: error.message
      };
    }
  });
}
