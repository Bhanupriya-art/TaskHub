# Quick Start Guide

## For Local Development

### 1. Database Setup
Install PostgreSQL and create a database:
```bash
createdb task_manager
```

### 2. Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```
Server runs on `http://localhost:5000`

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`

### 4. Test the App
1. Go to http://localhost:5173
2. Sign up with an account
3. Create a project
4. Add tasks and manage them

## API Documentation

Base URL: `http://localhost:5000/api` (development) or your Railway URL (production)

### Auth Endpoints
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Projects Endpoints
- `POST /projects` - Create project
- `GET /projects` - Get all projects
- `GET /projects/:id` - Get project details
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project
- `POST /projects/:id/members` - Add member
- `DELETE /projects/:id/members/:memberId` - Remove member

### Tasks Endpoints
- `POST /tasks` - Create task
- `GET /tasks/project/:projectId` - Get project tasks
- `GET /tasks/:id` - Get task details
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Dashboard Endpoints
- `GET /dashboard/stats` - Get dashboard statistics
- `GET /dashboard/assigned-to-me` - Get my tasks
- `GET /dashboard/overdue` - Get overdue tasks
- `GET /dashboard/summary/:projectId` - Get project summary

## Features

✅ User authentication (signup/login)
✅ Project management
✅ Task assignment and tracking
✅ Dashboard with statistics
✅ Team member management
✅ Role-based access control
✅ Task status and priority tracking
✅ Overdue task notifications

## Project Structure
```
.
├── backend/          - Node.js + Express API
├── frontend/         - React + Vite UI
├── README.md         - Project documentation
├── DEPLOYMENT.md     - Deployment guide
└── docker-compose.yml - Docker setup
```

## Technologies Used
- Backend: Node.js, Express, Prisma, PostgreSQL
- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Authentication: JWT, bcryptjs
- Deployment: Railway, Docker

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (macOS/Linux)
lsof -ti:5000 | xargs kill -9

# Or use different port in .env
PORT=5001
```

### Database Connection Error
Check DATABASE_URL in .env file is correct

### Frontend Can't Connect to API
Verify VITE_API_URL in frontend/.env points to correct backend URL

## Next Steps

1. Deploy on Railway (see DEPLOYMENT.md)
2. Set up custom domain
3. Add additional features (notifications, etc.)
4. Implement testing
5. Set up CI/CD pipeline

Happy coding! 🚀
