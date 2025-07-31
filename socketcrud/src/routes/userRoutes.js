import { createUser, deleteUser, getUser, getUsers, updateUser } from '../controllers/userController.js';
import { userSchema } from '../schema/userSchema.js';

export default async function userRoutes(fastify) {
  fastify.get('/users', getUsers);
  fastify.get('/users/:id', getUser);

  fastify.post('/users', { schema: userSchema }, (req, reply) =>
    createUser(req, reply, fastify)
  );

  fastify.put('/users/:id', { schema: userSchema }, (req, reply) =>
    updateUser(req, reply, fastify)
  );

  fastify.delete('/users/:id', (req, reply) =>
    deleteUser(req, reply, fastify)
  );
}
