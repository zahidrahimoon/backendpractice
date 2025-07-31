import UserRepository from '../repositories/userRepo.js';

function userController(fastify, opts, done) {
  const repo = new UserRepository();
  console.log("User repository created");

  fastify.post('/users', async (req, reply) => {
    try {
      const user = await repo.create(req.body);
      reply.code(201).send(user);
    } catch (error) {
      reply.code(400).send({ error: error.message });
    }
  });

  fastify.get('/users', async (req, reply) => {
    try {
      const users = await repo.findAll();
      reply.send(users);
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  });

  fastify.get('/users/:id', async (req, reply) => {
    try {
      const user = await repo.findById(req.params.id);
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }
      reply.send(user);
    } catch (error) {
      reply.code(400).send({ error: error.message });
    }
  });

  fastify.put('/users/:id', async (req, reply) => {
    try {
      const user = await repo.update(req.params.id, req.body);
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }
      reply.send(user);
    } catch (error) {
      reply.code(400).send({ error: error.message });
    }
  });

  fastify.delete('/users/:id', async (req, reply) => {
    try {
      const success = await repo.delete(req.params.id);
      if (!success) {
        return reply.code(404).send({ error: 'User not found' });
      }
      reply.send({ message: 'User deleted successfully' });
    } catch (error) {
      reply.code(400).send({ error: error.message });
    }
  });

  done();
}

export default userController;