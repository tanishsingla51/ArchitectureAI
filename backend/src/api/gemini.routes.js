// src/api/gemini.routes.js

// This file defines the API endpoints and connects them to the controller functions.

import { Router } from 'express';
import { generateSolution, getChatHistory } from './gemini.controller.js';

const router = Router();


router.post('/generate-solution', generateSolution);

router.get('/get-chat-history', getChatHistory);


export default router;
