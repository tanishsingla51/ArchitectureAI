

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import geminiRoutes from './api/gemini.routes.js';
import dotenv from 'dotenv';
import clerkMiddleware from './clerk.middleware.js';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'CLERK_SECRET_KEY', 'GOOGLE_API_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  console.error('Please set these variables in your Railway dashboard');
  process.exit(1);
}

// Initialize the Express app
const app = express();

// CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:3000', // Local development
    'http://localhost:5173', // Vite dev server
    process.env.FRONTEND_URL, // Your deployed frontend URL
    'https://*.vercel.app', // Vercel domains
    'https://*.netlify.app', // Netlify domains
    'https://*.render.com', // Render domains
  ].filter(Boolean), // Remove undefined values
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.use('/api', clerkMiddleware, geminiRoutes);

// Start the server with error handling
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});