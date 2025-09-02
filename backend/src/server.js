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

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000', // Local development
    'http://localhost:5173', // Vite dev server
    'https://architecture-ai-amber.vercel.app', // Your Vercel frontend
    'https://architecture-ai-eta.vercel.app', // Your other Vercel frontend
    'https://*.vercel.app', // All Vercel domains
    process.env.FRONTEND_URL, // Environment variable
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  Headers: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.use(clerkMiddleware);

app.use('/api', requireAuth , geminiRoutes);
app.use('/api/auth' , authRoutes);
app.use("/api/github", requireAuth , githubRoutes);

// Start the server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});