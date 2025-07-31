# Todo App - Feathers.js

A simple, modern todo application built with Feathers.js that allows users to manage their tasks with full CRUD operations.

## Features

- ✅ User authentication (register/login/logout)
- ✅ Create, read, update, and delete todos
- ✅ Mark todos as completed/incomplete
- ✅ Add descriptions to todos
- ✅ Real-time updates via WebSocket
- ✅ Responsive design for mobile and desktop
- ✅ Data persistence in MongoDB
- ✅ User-specific todos (each user only sees their own todos)

## Getting Started

### Prerequisites

- Node.js (>= 22.17.1)
- MongoDB running locally or a MongoDB connection string

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure MongoDB connection in `config/default.json`:
   ```json
   {
     "mongodb": "mongodb://localhost:27017/feathers-chat"
   }
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3030`

## Usage

### Authentication

1. **Register**: Click "Register" to create a new account with your email and password
2. **Login**: Use your email and password to log in
3. **Logout**: Click the logout button to sign out

### Managing Todos

1. **Add Todo**: Enter a title (required) and optional description, then click "Add Todo"
2. **Mark Complete**: Check the checkbox next to a todo to mark it as completed
3. **Delete Todo**: Click the trash icon to remove a todo (with confirmation)
4. **View Todos**: All your todos are displayed in a clean, organized list

### Todo Properties

Each todo has the following properties:
- **Title**: The main task description (required)
- **Description**: Additional details about the task (optional)
- **Completed**: Boolean status indicating if the task is done
- **Created At**: Timestamp when the todo was created
- **Updated At**: Timestamp when the todo was last modified
- **User ID**: Automatically assigned to the authenticated user

## API Endpoints

The todo service provides the following REST endpoints:

- `GET /todos` - Get all todos for the authenticated user
- `POST /todos` - Create a new todo
- `GET /todos/:id` - Get a specific todo
- `PATCH /todos/:id` - Update a todo
- `DELETE /todos/:id` - Delete a todo

All endpoints require authentication via JWT token.

## Database Schema

The todos are stored in a MongoDB collection with the following structure:

```javascript
{
  _id: ObjectId,
  title: String,
  description: String (optional),
  completed: Boolean (default: false),
  userId: ObjectId,
  createdAt: String (ISO date),
  updatedAt: String (ISO date)
}
```

## Security Features

- JWT-based authentication
- Password hashing using bcrypt
- User isolation (users can only access their own todos)
- Input validation and sanitization
- CORS protection

## Development

### Running Tests

```bash
npm test
```

### Code Formatting

```bash
npm run prettier
```

### Production Build

```bash
npm start
```

## Technologies Used

- **Backend**: Feathers.js, Node.js, MongoDB
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Authentication**: JWT, bcrypt
- **Real-time**: Socket.io
- **Styling**: Custom CSS with Font Awesome icons

## File Structure

```
src/
├── services/
│   ├── todos/
│   │   ├── todos.class.js      # Service class
│   │   ├── todos.schema.js     # Data validation schemas
│   │   ├── todos.shared.js     # Shared configuration
│   │   └── todos.js           # Service configuration
│   └── index.js               # Service registration
├── client.js                  # Client configuration
└── app.js                     # Main application
public/
└── index.html                # Todo app frontend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 