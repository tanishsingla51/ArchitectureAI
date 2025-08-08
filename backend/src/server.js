

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import geminiRoutes from './api/gemini.routes.js';
import dotenv from 'dotenv';
import clerkMiddleware from './clerk.middleware.js';

dotenv.config();

// Initialize the Express app.x
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
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.use('/api', clerkMiddleware, geminiRoutes);

// Start the server.
app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT || 8000}`);
});