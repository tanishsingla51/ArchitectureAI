

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import geminiRoutes from './api/gemini.routes.js';
import dotenv from 'dotenv';
import clerkMiddleware from './clerk.middleware.js';

dotenv.config();

// Initialize the Express app.x
const app = express();

app.use(cors());
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