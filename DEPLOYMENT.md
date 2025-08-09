# Deployment Guide

## Overview
This application consists of:
- **Frontend**: React/Vite application
- **Backend**: Node.js/Express API with Prisma database
- **Authentication**: Clerk
- **AI**: Google Gemini

## Deployment Options

### Option 1: Vercel + Render (Recommended)

#### Frontend Deployment (Vercel)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your repository
   - Set the root directory to `frontend`
   - Add environment variables:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com
     VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
     ```
   - Deploy

#### Backend Deployment (Render)

1. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Sign up/Login with GitHub
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Set the root directory to `backend`
   - Add environment variables:
     ```
     DATABASE_URL=your_database_url
     CLERK_SECRET_KEY=your_clerk_secret
     GEMINI_API_KEY=your_gemini_api_key
     PORT=8000
     ```
   - Deploy

2. **Set up Database**
   - In Render dashboard, add a PostgreSQL database
   - Copy the DATABASE_URL to your environment variables
   - Run migrations:
     ```bash
     npx prisma migrate deploy
     ```

### Option 2: Netlify + Heroku

#### Frontend (Netlify)
- Use Netlify's static site service
- Build command: `npm run build`
- Publish directory: `dist`

#### Backend (Heroku)
- Use Heroku's Node.js buildpack
- Add PostgreSQL addon
- Set environment variables

### Option 3: Local Development

For local development, you can run both services locally:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Backend (.env)
```
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_test_...
GEMINI_API_KEY=your_gemini_api_key
PORT=8000
```

## Post-Deployment Steps

1. **Update CORS settings** in backend if needed
2. **Test all functionality** on deployed URLs
3. **Set up custom domain** (optional)
4. **Configure monitoring** and logging

## Troubleshooting

### Common Issues:
- **CORS errors**: Ensure backend URL is correct in frontend env vars
- **Database connection**: Check DATABASE_URL format and permissions
- **API key issues**: Verify all environment variables are set correctly
- **Build failures**: Check Node.js version compatibility

### Debug Commands:
```bash
# Check backend logs
npm run dev

# Check frontend build
npm run build

# Test API locally
curl http://localhost:8000/api/health
```

## Cost Estimation

- **Vercel**: Free tier (Hobby) - $0/month
- **Render**: Free tier - $0/month (limited usage)
- **Database**: Free tier PostgreSQL available
- **Total**: ~$0-20/month depending on usage 