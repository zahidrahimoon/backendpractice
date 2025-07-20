import Fastify from 'fastify'
import userRoutes from './routes/userRoutes.js';

const fastify = Fastify({
  logger: true
})

fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' });
  });

fastify.register(userRoutes);

const start = async () => {
    try {
      await fastify.listen({ port: 3000 });
      console.log('Server listening on http://localhost:3000');
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };
  
  start();