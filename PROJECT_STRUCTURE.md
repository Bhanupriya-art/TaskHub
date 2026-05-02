# Project Structure & File Guide

## Team Task Manager - Complete File Structure

```
team-task-manager/
├── backend/
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── projects.js          # Project management endpoints
│   │   ├── tasks.js             # Task management endpoints
│   │   └── dashboard.js         # Dashboard statistics endpoints
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema definition
│   │   └── migrations/          # Database migration files
│   ├── .env                     # Environment variables (local)
│   ├── .env.example             # Example environment variables
│   ├── .railway/
│   │   └── config.toml          # Railway deployment config
│   ├── Dockerfile              # Docker image for backend
│   ├── server.js               # Express server entry point
│   ├── package.json            # Node dependencies
│   └── node_modules/           # Installed packages
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Signup.jsx       # Signup page
│   │   │   ├── Dashboard.jsx    # Dashboard page
│   │   │   ├── Projects.jsx     # Projects list page
│   │   │   └── ProjectDetail.jsx # Project detail & tasks page
│   │   ├── components/
│   │   │   └── Navigation.jsx   # Navigation bar component
│   │   ├── api.js              # API client with axios
│   │   ├── App.jsx             # Main React component
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Global styles with Tailwind
│   ├── public/
│   ├── index.html              # HTML entry point
│   ├── .env                    # Environment variables (local)
│   ├── .env.example            # Example environment variables
│   ├── .railway/
│   │   └── config.toml         # Railway deployment config
│   ├── Dockerfile             # Docker image for frontend
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── postcss.config.js       # PostCSS configuration
│   ├── package.json            # Node dependencies
│   └── node_modules/           # Installed packages
│
├── .gitignore                  # Git ignore rules
├── docker-compose.yml          # Docker Compose for local dev
├── README.md                   # Main project documentation
├── QUICKSTART.md              # Quick start guide
├── DEPLOYMENT.md              # Local & basic deployment guide
├── RAILWAY_DEPLOYMENT.md      # Detailed Railway deployment guide
└── PROJECT_STRUCTURE.md       # This file
```

## File Descriptions

### Backend Files

#### `server.js`
- Express application entry point
- Initializes middleware (CORS, JSON parser)
- Sets up routes for auth, projects, tasks, dashboard
- Handles errors and 404 responses

#### `routes/auth.js`
- POST /signup - User registration with password hashing
- POST /login - User login with JWT token generation
- GET /me - Get current user (requires authentication)

#### `routes/projects.js`
- POST / - Create new project
- GET / - Get all projects for current user
- GET /:id - Get project details with members and tasks
- PUT /:id - Update project (admin only)
- DELETE /:id - Delete project (admin only)
- POST /:id/members - Add team member (admin only)
- DELETE /:id/members/:memberId - Remove team member (admin only)

#### `routes/tasks.js`
- POST / - Create task in a project
- GET /project/:projectId - Get all tasks for a project with filters
- GET /:id - Get single task details
- PUT /:id - Update task status, priority, assignee
- DELETE /:id - Delete task (project admin only)

#### `routes/dashboard.js`
- GET /stats - Overall statistics (total, completed, pending, overdue tasks)
- GET /assigned-to-me - Tasks assigned to current user
- GET /overdue - All overdue tasks across projects
- GET /summary/:projectId - Task breakdown by status and priority

#### `middleware/auth.js`
- `authMiddleware` - Validates JWT token and extracts user info
- `requireAdmin` - Checks if user is admin (used at route level)

#### `prisma/schema.prisma`
- Database schema with 5 models: User, Project, ProjectMember, Task
- Defines relationships, enums, and indexes
- Supports PostgreSQL

### Frontend Files

#### `api.js`
- Axios instance with base URL configuration
- Request interceptor to add JWT token to all requests
- Organized API endpoints by feature (authAPI, projectsAPI, tasksAPI, dashboardAPI)

#### `pages/Login.jsx`
- Email and password input fields
- Stores token and userId in localStorage
- Redirects to dashboard on success

#### `pages/Signup.jsx`
- Name, email, password input fields
- User registration with validation
- Auto-login after signup

#### `pages/Dashboard.jsx`
- Summary statistics cards (total, completed, in progress, overdue)
- Tasks assigned to current user
- Overdue tasks alert section

#### `pages/Projects.jsx`
- List of all projects for user
- Create new project form
- Delete project functionality
- Quick stats per project

#### `pages/ProjectDetail.jsx`
- Project details with team members
- Task summary statistics
- Create new task form with assignment
- Task status updates
- Delete task functionality (admin only)

#### `components/Navigation.jsx`
- Top navigation bar
- Links to Dashboard and Projects
- User name display
- Logout button

#### `App.jsx`
- Main application component
- React Router setup with private routes
- Authentication state management
- Loads user on app startup

### Configuration Files

#### `package.json` (Backend & Frontend)
- Project metadata
- Dependencies and dev dependencies
- NPM scripts for development and production

#### `.env` & `.env.example`
- Environment variables for configuration
- `.env.example` shows required variables
- `.env` contains actual values (not committed to git)

#### `Dockerfile` (Backend & Frontend)
- Multi-stage Docker build
- Production-optimized images
- Proper port exposure and health checks

#### `docker-compose.yml`
- PostgreSQL service definition
- Backend service configuration
- Frontend service configuration
- Volume management for data persistence

#### `vite.config.js`
- Vite build configuration for frontend
- React plugin configuration
- Development server settings

#### `tailwind.config.js`
- Tailwind CSS utility configuration
- Custom theme extensions (if needed)
- Content paths for JIT compilation

#### `postcss.config.js`
- PostCSS plugin configuration
- Tailwind CSS and Autoprefixer setup

### Documentation Files

#### `README.md`
- Project overview
- Key features
- Tech stack overview
- Quick setup instructions
- API endpoint summary
- Database schema overview

#### `QUICKSTART.md`
- Fastest way to get up and running
- Local development setup steps
- API quick reference
- Feature checklist
- Basic troubleshooting

#### `DEPLOYMENT.md`
- Detailed local development setup
- Database setup options (local PostgreSQL / Docker)
- Step-by-step backend and frontend setup
- Production Railway deployment overview
- Environment variables reference
- Troubleshooting guide

#### `RAILWAY_DEPLOYMENT.md`
- Complete Railway deployment walkthrough
- Prerequisites and setup
- Step-by-step deployment process
- PostgreSQL database setup on Railway
- Backend deployment configuration
- Frontend deployment configuration
- Verification steps
- Troubleshooting for Railway
- Custom domain setup
- Monitoring and scaling

## Key Technologies

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Relational database
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **ES Modules** - Module system

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Railway** - Deployment platform
- **Git/GitHub** - Version control

## Environment Variables

### Backend
```
DATABASE_URL       # PostgreSQL connection string
JWT_SECRET        # Secret for JWT signing
PORT              # Server port (default: 5000)
NODE_ENV          # Environment (development/production)
```

### Frontend
```
VITE_API_URL      # Backend API URL (default: http://localhost:5000/api)
```

## Database Schema

### Users Table
- id (Primary Key)
- email (Unique)
- password (Hashed)
- name
- createdAt, updatedAt

### Projects Table
- id (Primary Key)
- name
- description
- adminId (Foreign Key → Users)
- createdAt, updatedAt

### ProjectMembers Table
- id (Primary Key)
- projectId (Foreign Key → Projects)
- userId (Foreign Key → Users)
- role (ADMIN, MEMBER)
- joinedAt

### Tasks Table
- id (Primary Key)
- projectId (Foreign Key → Projects)
- title
- description
- assignedTo (Foreign Key → Users, nullable)
- status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- priority (LOW, MEDIUM, HIGH)
- dueDate (nullable)
- createdAt, updatedAt

## Routes Summary

### Authentication
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user

### Projects
- `POST /api/projects` - Create
- `GET /api/projects` - List
- `GET /api/projects/:id` - Details
- `PUT /api/projects/:id` - Update
- `DELETE /api/projects/:id` - Delete
- `POST /api/projects/:id/members` - Add member
- `DELETE /api/projects/:id/members/:memberId` - Remove member

### Tasks
- `POST /api/tasks` - Create
- `GET /api/tasks/project/:projectId` - List
- `GET /api/tasks/:id` - Details
- `PUT /api/tasks/:id` - Update
- `DELETE /api/tasks/:id` - Delete

### Dashboard
- `GET /api/dashboard/stats` - Statistics
- `GET /api/dashboard/assigned-to-me` - My tasks
- `GET /api/dashboard/overdue` - Overdue tasks
- `GET /api/dashboard/summary/:projectId` - Project summary

## Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make changes** in backend and/or frontend

3. **Test locally**
   ```bash
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "Feature: description"
   ```

5. **Push to GitHub**
   ```bash
   git push origin feature/new-feature
   ```

6. **Create Pull Request** on GitHub

7. **Deploy to Railway** (auto-deploys on main branch)

## Deployment Checklist

- [ ] All dependencies in package.json
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] API endpoints tested
- [ ] Frontend pages responsive
- [ ] Authentication working
- [ ] Error handling implemented
- [ ] Code committed to GitHub
- [ ] Railway services created
- [ ] Environment variables set in Railway
- [ ] Database migrations run
- [ ] Frontend/Backend URLs accessible
- [ ] Demo tested end-to-end

---

For more details, refer to:
- README.md - Project overview
- QUICKSTART.md - Quick setup
- RAILWAY_DEPLOYMENT.md - Deployment guide
