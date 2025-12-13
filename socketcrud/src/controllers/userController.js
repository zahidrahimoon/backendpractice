import { User } from "../models/userModel.js";

export const createUser = async (req, reply, fastify) => {
  try {
    const newUser = await User.create(req.body);
    fastify.io.emit('userCreated', newUser);
    reply.code(201).send(newUser);
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};

export const updateUser = async (req, reply, fastify) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return reply.code(404).send({ error: 'User not found' });

  await user.update(req.body);
  fastify.io.emit('userUpdated', user);
  reply.send(user);
};

export const deleteUser = async (req, reply, fastify) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return reply.code(404).send({ error: 'User not found' });

  await user.destroy();
  fastify.io.emit('userDeleted', { id: req.params.id });
  reply.send({ message: 'User deleted' });
};

export const getUser = async (req, reply) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }
    reply.send(user);
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};

export const getUsers = async (req, reply) => {
  try {
    const users = await User.findAll();
    reply.send(users);
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};