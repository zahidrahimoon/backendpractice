class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async createUser(userData) {
    if (!userData.name || !userData.email) {
      throw new Error('Name and email are required');
    }

    const existingUsers = await this.userRepository.findAll();
    const emailExists = existingUsers.some(user => user.email === userData.email);
    if (emailExists) {
      throw new Error('Email already exists');
    }

    return await this.userRepository.create(userData);
  }

  async getUsers() {
    return await this.userRepository.findAll();
  }

  async getUserById(id) {
    if (!id) {
      throw new Error('User ID is required');
    }
    return await this.userRepository.findById(id);
  }

  async updateUser(id, userData) {
    if (!id) {
      throw new Error('User ID is required');
    }

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    if (!userData.name && !userData.email) {
      throw new Error('At least name or email must be provided for update');
    }

    return await this.userRepository.update(id, userData);
  }

  async deleteUser(id) {
    if (!id) {
      throw new Error('User ID is required');
    }

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    return await this.userRepository.delete(id);
  }
}

export default UserService;
