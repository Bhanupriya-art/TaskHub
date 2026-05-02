# Team Task Manager - Full Stack Application

A comprehensive web application for managing projects, tasks, and team collaboration with role-based access control.

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Project Management**: Create projects, manage team members with admin/member roles
- **Task Management**: Create, assign, update, and track tasks with status and priority
- **Dashboard**: Overview of all tasks, completion status, and overdue items
- **Role-Based Access Control**: Admin can manage projects and members, members can create tasks
- **Real-time Updates**: Responsive UI with real-time task status updates

## Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL (via Prisma ORM)
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 18 + Vite
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls

## Project Structure

```
team-task-manager/
├── backend/
│   ├── routes/
│   │   ├── auth.js       # Authentication endpoints
│   │   ├── projects.js   # Project management endpoints
│   │   ├── tasks.js      # Task management endpoints
│   │   └── dashboard.js  # Dashboard statistics endpoints
│   ├── middleware/
│   │   └── auth.js       # JWT authentication middleware
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   ├── server.js         # Express server
│   ├── .env              # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── api.js        # API client
│   │   ├── App.jsx       # Main app component
│   │   └── index.css     # Tailwind CSS
│   ├── .env              # Frontend env variables
│   └── package.json
└── README.md
```

## Database Schema

### Users
- id, email, password, name, createdAt, updatedAt

### Projects
- id, name, description, adminId, createdAt, updatedAt

### ProjectMembers
- id, projectId, userId, role (ADMIN/MEMBER), joinedAt

### Tasks
- id, projectId, title, description, assignedTo, status, priority, dueDate, createdAt, updatedAt

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires auth)

### Projects
- `POST /api/projects` - Create project (requires auth)
- `GET /api/projects` - Get all projects for user (requires auth)
- `GET /api/projects/:id` - Get project details (requires auth)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)
- `POST /api/projects/:id/members` - Add member (admin only)
- `DELETE /api/projects/:id/members/:memberId` - Remove member (admin only)

### Tasks
- `POST /api/tasks` - Create task (requires auth)
- `GET /api/tasks/project/:projectId` - Get project tasks (requires auth)
- `GET /api/tasks/:id` - Get task details (requires auth)
- `PUT /api/tasks/:id` - Update task (requires auth)
- `DELETE /api/tasks/:id` - Delete task (admin only)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/assigned-to-me` - Get tasks assigned to me
- `GET /api/dashboard/overdue` - Get overdue tasks
- `GET /api/dashboard/summary/:projectId` - Get project task summary

## Setup Instructions

### Prerequisites
- Node.js 16+ 
- PostgreSQL 12+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with database URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/task_manager"
JWT_SECRET="your-secret-key-change-this-in-production"
PORT=5000
NODE_ENV="development"
```

4. Run database migrations:
```bash
npx prisma migrate dev --name init
```

5. Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Deployment on Railway

### Backend Deployment

1. Push code to GitHub
2. Create Railway account and connect GitHub repository
3. Create PostgreSQL database on Railway
4. Set environment variables in Railway:
   - `DATABASE_URL` - Railway PostgreSQL connection string
   - `JWT_SECRET` - Strong secret key
   - `NODE_ENV` - "production"
   - `PORT` - 5000

5. Deploy service

### Frontend Deployment

1. Build frontend:
```bash
npm run build
```

2. Create new Railway service for frontend
3. Set `VITE_API_URL` to your backend Railway URL
4. Deploy service

## Usage

1. **Sign Up**: Create a new account with email and password
2. **Create Project**: Go to Projects page and create a new project
3. **Add Members**: Add team members to your project (admin only)
4. **Create Tasks**: Add tasks within projects with details and assignments
5. **Update Tasks**: Change task status, priority, and assignments
6. **View Dashboard**: Monitor overall progress and overdue tasks

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control (RBAC)
- Input validation and error handling
- CORS enabled for secure API access
- SQL injection prevention with Prisma ORM

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create an issue in the GitHub repository.

## Author

Created as a full-stack web application project with Node.js, React, and PostgreSQL.
