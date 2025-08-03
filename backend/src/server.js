// src/index.js

// This is the main entry point for the entire application.
// It initializes the Express server and connects all the pieces.

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import geminiRoutes from './api/gemini.routes.js';

// Initialize the Express app.x
const app = express();
const PORT = process.env.PORT || 3001;

// Apply middleware.
app.use(cors());
app.use(bodyParser.json());

// Register the API routes.
// We prefix the routes with '/api'.
app.use('/api', geminiRoutes);

// Start the server.
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});