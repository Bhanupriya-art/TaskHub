# Railway Deployment Guide

## Complete Step-by-Step Instructions

This guide will help you deploy the Team Task Manager application on Railway with a live PostgreSQL database.

## Prerequisites

1. **GitHub Account**: Your code must be on GitHub
2. **Railway Account**: Create free account at https://railway.app
3. **Git Installed**: For version control

## Step 1: Prepare Your Code

### Create GitHub Repository

```bash
cd /Users/sahilsingh/Desktop/company\ project

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Team Task Manager - Ready for deployment"

# Add remote (replace with your GitHub repo)
git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git

# Push to GitHub
git push -u origin main
```

## Step 2: Set Up PostgreSQL on Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "Create a New Project"
3. Select "Database" → "PostgreSQL"
4. Wait for database to provision
5. Click on PostgreSQL service
6. Go to "Connect" tab
7. Copy the PostgreSQL Connection URL
   - It will look like: `postgresql://user:password@host:port/railway`

## Step 3: Deploy Backend

### A. Create Backend Service

1. In Railway Project, click "New Service" → "GitHub Repo"
2. Authorize GitHub and select `team-task-manager` repository
3. Railway will auto-detect package.json in root - **IMPORTANT**: Select the `backend` folder
4. Click "Deploy"

### B. Configure Backend Environment Variables

In Railway Backend Service → Variables tab, add:

```
DATABASE_URL=postgresql://user:password@host:port/railway
JWT_SECRET=generate-a-long-random-string-min-32-chars-here
NODE_ENV=production
PORT=5000
```

**To generate JWT_SECRET**, run this in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### C. Enable Backend on Railway
- The backend will auto-start on Railway's assigned port
- Get the public URL from Railway Backend Service → "Environment"
- Look for `RAILWAY_STATIC_URL` or the generated domain

## Step 4: Deploy Frontend

### A. Create Frontend Service

1. In Railway Project, click "New Service" → "GitHub Repo"
2. Select the same `team-task-manager` repository
3. Select the `frontend` folder
4. Click "Deploy"

### B. Configure Frontend Environment Variables

In Railway Frontend Service → Variables tab, add:

```
VITE_API_URL=https://YOUR-BACKEND-RAILWAY-URL/api
```

Replace `YOUR-BACKEND-RAILWAY-URL` with your actual backend URL from Step 3C.

### C. Build Configuration

Railway should auto-detect and run:
- Build: `npm run build`
- Start: Uses serve to run the built frontend

## Step 5: Verify Deployment

### Test Backend

```bash
curl https://YOUR-BACKEND-URL/health
# Should return: {"status":"OK"}
```

### Test Frontend

1. Visit the frontend URL provided by Railway
2. You should see the login page
3. Sign up with a test account
4. Create a project and add tasks

## Step 6: Database Migrations

Railway automatically runs migrations if you update your Prisma schema. However, to manually run them:

1. In Backend Service, go to "Shell" tab
2. Run: `npx prisma migrate deploy`

Or add to backend package.json:

```json
{
  "scripts": {
    "start": "npx prisma migrate deploy && node server.js"
  }
}
```

## Troubleshooting

### Frontend Not Loading

**Problem**: "Cannot GET /"
- Solution: Ensure Dockerfile for frontend is correct and using `serve` to run the built app

**Problem**: "API connection refused"
- Solution: Check `VITE_API_URL` is correctly set and matches your backend URL

### Backend Not Running

**Problem**: Connection refused on `DATABASE_URL`
- Solution: Verify PostgreSQL service is running and connection string is correct

**Problem**: Port already in use
- Solution: Change PORT to different value in env variables

### Database Issues

**Problem**: Prisma migration errors
- Check database has proper permissions
- Verify DATABASE_URL is correct
- Try manual migration in Railway shell

### Deployment Fails

**Problem**: Build fails on Railway
- Check build logs in Railway dashboard
- Verify all dependencies in package.json
- Ensure Node version is 16+

## Environment Variables Reference

### Backend Required
```
DATABASE_URL         # PostgreSQL connection string
JWT_SECRET          # 32+ character random string
NODE_ENV            # "production"
PORT                # "5000"
```

### Frontend Required
```
VITE_API_URL        # Your backend Railway URL + /api
```

## Custom Domain (Optional)

1. Railway Project Settings
2. "Custom Domain"
3. Add your domain
4. Update DNS records as Railway instructs
5. SSL certificate auto-provisioned

## Monitoring

### View Logs

1. Select service (Backend or Frontend)
2. Click "Logs" tab
3. View real-time output

### Monitor Database

1. Select PostgreSQL service
2. Metrics tab shows connections, queries, etc.

## Scaling

### Auto-scaling on Railway

1. Backend Service → Settings
2. Enable "Auto-scaling"
3. Set CPU and Memory limits

## Backup & Restore

### Database Backup

Railway auto-backups PostgreSQL. To download:

1. PostgreSQL Service → Settings
2. "Data Backup"
3. Download backup file

## Cost Management

- Railway has generous free tier
- Monitor usage in Billing
- Set spending limit if needed

## CI/CD Pipeline

Railway auto-deploys on:
- Push to main branch
- Pull request previews available
- Failed builds notified

## Post-Deployment

1. Change default JWT_SECRET to strong random value
2. Set up monitoring alerts
3. Configure regular backups
4. Document API endpoints
5. Create user documentation

## Support & Resources

- [Railway Documentation](https://docs.railway.app)
- [Railway Community Discord](https://discord.gg/railway)
- Check Railway status at [status.railway.app](https://status.railway.app)

---

**Deployment Complete!** 🎉

Your Team Task Manager is now live on Railway. Share the frontend URL with your team to start using it!

### Quick Links After Deployment

- **Frontend**: `https://your-frontend-railway.railway.app`
- **Backend API**: `https://your-backend-railway.railway.app/api`
- **Health Check**: `https://your-backend-railway.railway.app/health`

Happy coding! 🚀
