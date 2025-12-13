
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../controllers/userController.js';
import { userSchema } from '../schema/userSchema.js';
  
  
  async function userRoutes(fastify) {
    fastify.get('/users', getUsers);
    fastify.get('/users/:id', getUser);
    fastify.post('/users', { schema: userSchema }, createUser);
    fastify.put('/users/:id', { schema: userSchema }, updateUser);
    fastify.delete('/users/:id', deleteUser);
  }
  
  export default userRoutes;
  