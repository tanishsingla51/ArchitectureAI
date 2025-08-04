// src/index.js

// This is the main entry point for the entire application.
// It initializes the Express server and connects all the pieces.

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import geminiRoutes from './api/gemini.routes.js';
import clerkMiddleware from './clerk.middleware.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Express app.x
const app = express();
const PORT = process.env.PORT || 3001;

// Apply middleware.
app.use(cors());
app.use(bodyParser.json());

// Register the API routes.
// We prefix the routes with '/api'.
app.use('/api', clerkMiddleware);
app.use('/api',  geminiRoutes);

// Start the server.
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});