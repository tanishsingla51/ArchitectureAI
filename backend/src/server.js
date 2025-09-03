import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import geminiRoutes from './api/gemini.routes.js';
import dotenv from 'dotenv';
import {clerkMiddleware , requireAuth} from './clerk.middleware.js';
import authRoutes from './api/auth.routes.js';
import githubRoutes from './api/github.routes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

// Initialize the Express app
const app = express();

// CORS configuration - Fixed wildcard issue
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://architecture-ai-amber.vercel.app',
      'https://architecture-ai-eta.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Check if the origin ends with .vercel.app (for dynamic Vercel deployments)
    const isVercelApp = origin.endsWith('.vercel.app');
    
    if (allowedOrigins.includes(origin) || isVercelApp) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['set-cookie'], // Important for cookie handling
};

app.use(cookieParser());
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

// Apply Clerk middleware globally
app.use(clerkMiddleware);

// Routes
app.use('/api', requireAuth, geminiRoutes);
app.use('/api/auth', authRoutes); // No requireAuth here since it includes login routes
app.use('/api/github', requireAuth, githubRoutes);

// Basic error handling middleware (should be after routes)
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({ error: 'CORS policy violation' });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
});