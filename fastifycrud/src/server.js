import Fastify from 'fastify'

const fastify = Fastify({
  logger: true
})

fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})

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