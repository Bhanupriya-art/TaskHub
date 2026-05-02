# Team Task Manager - Deployment Guide

## Local Development Setup

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- Git

### Step 1: Database Setup

#### Option A: Using Local PostgreSQL
1. Install PostgreSQL
2. Create a database:
```sql
CREATE DATABASE task_manager;
```

3. Update backend `.env` file:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/task_manager"
JWT_SECRET="your-super-secret-key-here"
PORT=5000
NODE_ENV="development"
```

#### Option B: Using Docker
```bash
docker-compose up postgres
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Run migrations
npx prisma migrate dev --name init

# Start development server
npm run dev
```

Backend will be available at `http://localhost:5000`

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Production Deployment on Railway

### Prerequisites
- Railway account (https://railway.app)
- GitHub account with your code repository
- PostgreSQL database connection details

### Step 1: Create GitHub Repository

```bash
# Initialize git in project root
git init
git add .
git commit -m "Initial commit: Team Task Manager"

# Push to GitHub
git remote add origin https://github.com/yourusername/team-task-manager.git
git push -u origin main
```

### Step 2: Deploy on Railway

#### A. PostgreSQL Database
1. Go to Railway dashboard
2. Create new project
3. Add PostgreSQL database
4. Copy the connection string (you'll need this for backend env variables)

#### B. Backend Deployment
1. Go to Railway dashboard
2. Create new service -> Deploy from GitHub
3. Select your repository
4. Connect the PostgreSQL database
5. Set environment variables:
   ```
   DATABASE_URL=<your-railway-postgres-url>
   JWT_SECRET=<generate-a-secure-random-string>
   NODE_ENV=production
   PORT=5000
   ```
6. Deploy

#### C. Frontend Deployment
1. Create new service -> Deploy from GitHub
2. Select your repository
3. Set environment variables:
   ```
   VITE_API_URL=https://your-backend-railway-url.railway.app/api
   ```
4. Deploy

### Step 3: Verify Deployment

1. Check backend health: `https://your-backend-url/health`
2. Access frontend: `https://your-frontend-url`
3. Test login functionality

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-secret-key-min-32-chars"
PORT=5000
NODE_ENV="production"
```

### Frontend (.env)
```
VITE_API_URL="https://your-backend-url/api"
```

## Database Migrations

To run migrations on Railway:

1. SSH into Railway backend service
2. Run: `npx prisma migrate deploy`

Or setup automatic migrations:

Update backend package.json scripts:
```json
{
  "scripts": {
    "start": "npx prisma migrate deploy && node server.js"
  }
}
```

## Monitoring and Logs

### Railway Logs
1. Go to Railway dashboard
2. Select service
3. View logs in real-time

### Check Backend Health
```bash
curl https://your-backend-url/health
```

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` format
- Check PostgreSQL is running
- Ensure credentials are correct
- Test connection with: `psql $DATABASE_URL`

### Frontend Not Loading
- Check `VITE_API_URL` is correct
- Verify CORS is enabled on backend
- Check browser console for errors

### API Requests Failing
- Check backend logs for errors
- Verify token is being sent in Authorization header
- Check request format matches API specification

### Build Failures
- Clear node_modules and reinstall
- Check Node version (16+ required)
- Verify all dependencies are specified in package.json

## Performance Optimization

### Backend
- Use database indexes (already configured in Prisma schema)
- Implement caching for frequently accessed data
- Use connection pooling with PostgreSQL

### Frontend
- Code splitting with React.lazy()
- Image optimization
- CSS minification (Vite handles this)

## Security Considerations

- Change JWT_SECRET to a strong random value
- Enable HTTPS (Railway handles this by default)
- Regularly update dependencies
- Use environment variables for sensitive data
- Implement rate limiting for API endpoints
- Add CSRF protection

## Scaling Considerations

- Use Railway's auto-scaling features
- Optimize database queries
- Implement caching strategy
- Consider adding CDN for frontend

## Support

For issues or questions:
1. Check GitHub Issues
2. Review this guide
3. Check Railway documentation
4. Contact support

---

**Last Updated:** April 2026
**Version:** 1.0.0
