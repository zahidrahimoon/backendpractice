import Fastify from 'fastify'
import userRoutes from './routes/userRoutes.js';
import fastifyIO from "fastify-socket.io";

const fastify = Fastify({
  logger: true
})

fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' });
  });

fastify.register(userRoutes);
fastify.register(fastifyIO);

fastify.ready(err => {
  if (err) throw err;
  fastify.io.on('connection', socket => {
    console.log('Client connected:', socket.id);
  });
});

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