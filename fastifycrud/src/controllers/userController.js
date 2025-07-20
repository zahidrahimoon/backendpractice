import { User } from "../models/userModel.js";


export const getUsers = async (_, reply) => {
  const users = await User.findAll();
  reply.send(users);
};

export const getUser = async (req, reply) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return reply.code(404).send({ error: 'User not found' });
  reply.send(user);
};

export const createUser = async (req, reply) => {
  try {
    const newUser = await User.create(req.body);
    reply.code(201).send(newUser);
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};

export const updateUser = async (req, reply) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return reply.code(404).send({ error: 'User not found' });
  await user.update(req.body);
  reply.send(user);
};

export const deleteUser = async (req, reply) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return reply.code(404).send({ error: 'User not found' });
  await user.destroy();
  reply.send({ message: 'User deleted' });
};
