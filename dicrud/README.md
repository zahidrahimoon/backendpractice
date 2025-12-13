# DI-CRUD API

A clean, scalable Node.js REST API built with Fastify, Sequelize, and Dependency Injection (DI) principles.

## What is Dependency Injection (DI)?

Dependency Injection is a design pattern that implements Inversion of Control (IoC) for managing dependencies between classes. Instead of classes creating their own dependencies, dependencies are "injected" from the outside.

### Core Concepts

1. **Dependency**: Any object that another object needs to function
2. **Injection**: The process of providing dependencies to a class
3. **Container**: A central registry that manages and resolves dependencies

## Why Use Dependency Injection?

### 1. **Loose Coupling**
- Classes don't need to know how to create their dependencies
- Dependencies can be easily swapped without changing the dependent class
- Reduces tight coupling between components

### 2. **Testability**
- Easy to mock dependencies for unit testing
- Isolated testing of individual components
- Better test coverage and reliability

### 3. **Maintainability**
- Clear separation of concerns
- Easier to modify and extend functionality
- Better code organization

### 4. **Reusability**
- Dependencies can be shared across multiple classes
- Consistent behavior across the application
- Reduced code duplication

## How DI is Implemented in This Project

### Project Structure
```
src/
├── di/
│   └── container.js          # DI Container
├── controllers/
│   └── userController.js     # HTTP Controllers
├── services/
│   └── userServices.js       # Business Logic Layer
├── repositories/
│   └── userRepo.js          # Data Access Layer
├── models/
│   ├── User.js              # Database Models
│   └── index.js             # Model Registry
└── config/
    └── database.js          # Database Configuration
```

### DI Container Implementation

The DI container (`src/di/container.js`) uses Fastify's plugin system to inject dependencies:

```javascript
import fastifyPlugin from 'fastify-plugin';
import { sequelize, initializeDatabase } from '../models/index.js';

async function dbPlugin(fastify) {
  await initializeDatabase();
  
  fastify.decorate('sequelize', sequelize);
  fastify.decorate('models', sequelize.models);
}

export default fastifyPlugin(dbPlugin);
```

### Dependency Flow

1. **Database Layer** → **Repository Layer** → **Service Layer** → **Controller Layer**

2. **Each layer depends on the layer below it, but doesn't create it directly**

3. **Dependencies are injected through constructors or method parameters**

### Example: User Management Flow

```javascript
// Controller receives repository through constructor
function userController(fastify, opts, done) {
  const repo = new UserRepository();  // Dependency created
  
  fastify.post('/users', async (req, reply) => {
    const user = await repo.create(req.body);  // Uses injected dependency
    reply.code(201).send(user);
  });
}

// Repository uses injected database models
class UserRepository {
  async create({ name, email }) {
    const user = await User.create({ name, email });  // Uses injected User model
    return user.toJSON();
  }
}
```

## Benefits in This Project

### 1. **Database Abstraction**
- Repository pattern abstracts database operations
- Easy to switch from Sequelize to another ORM
- Database logic is isolated and testable

### 2. **Service Layer Benefits**
- Business logic is separated from HTTP concerns
- Services can be reused across different controllers
- Easy to add validation, caching, or logging

### 3. **Controller Simplification**
- Controllers focus only on HTTP request/response handling
- No direct database or business logic dependencies
- Clean and focused responsibility

### 4. **Testing Advantages**
- Each layer can be tested independently
- Mock repositories for controller tests
- Mock services for repository tests
- Isolated unit tests with high coverage

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| POST | `/api/users` | Create a new user |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |


## Best Practices

1. **Single Responsibility**: Each class has one clear purpose
2. **Interface Segregation**: Dependencies should be minimal and focused
3. **Dependency Inversion**: High-level modules don't depend on low-level modules
4. **Configuration as Code**: Dependencies are configured in the container
5. **Lifecycle Management**: Container manages object creation and destruction

## Future Enhancements

- Add a proper DI container library (like `awilix`)
- Implement interface-based dependency injection
- Add dependency resolution and circular dependency detection
- Implement scoped and singleton dependency management
- Add dependency injection for configuration and environment variables

## Conclusion

Dependency Injection in this project provides:
- **Clean Architecture**: Clear separation of concerns
- **Maintainable Code**: Easy to modify and extend
- **Testable Components**: Isolated testing capabilities
- **Scalable Structure**: Easy to add new features and modules
- **Professional Standards**: Industry best practices implementation
