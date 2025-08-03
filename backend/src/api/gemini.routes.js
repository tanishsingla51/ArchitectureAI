// src/api/gemini.routes.js

// This file defines the API endpoints and connects them to the controller functions.

import { Router } from 'express';
import { generateSolution } from './gemini.controller.js';

const router = Router();

// Define the POST route for generating a solution.
// When a POST request is made to this path, the generateSolution controller function is executed.
router.post('/generate-solution', generateSolution);

export default router;
