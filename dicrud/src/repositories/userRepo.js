import { User } from '../models/index.js';

class UserRepository {
  constructor() {
    console.log('UserRepository initialized with Sequelize');
  }

  async create({ name, email }) {
    try {
      const user = await User.create({ name, email });
      return user.toJSON();
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Email already exists');
      }
      throw new Error('Failed to create user');
    }
  }

  async findAll() {
    try {
      const users = await User.findAll({
        order: [['created_at', 'DESC']]
      });
      return users.map(user => user.toJSON());
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  }

  async findById(id) {
    try {
      const user = await User.findByPk(id);
      return user ? user.toJSON() : null;
    } catch (error) {
      throw new Error('Failed to fetch user');
    }
  }

  async update(id, { name, email }) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return null;
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;

      await user.update(updateData);
      return user.toJSON();
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Email already exists');
      }
      throw new Error('Failed to update user');
    }
  }

  async delete(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return false;
      }
      await user.destroy();
      return true;
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  }
}

export default UserRepository;