// src/api/gemini.controller.js

// The controller's job is to handle the HTTP request and response.
// It orchestrates the flow but doesn't contain the core business logic.

import { generateContentFromPrompt } from './gemini.service.js';

// This function will be called when the API route is hit.
export async function generateSolution(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // Call the service function to generate the content.
    const solution = await generateContentFromPrompt(prompt);

    if (solution) {
      res.status(200).json({ solution });
    } else {
      res.status(500).json({ error: 'No content was returned from the API.' });
    }
  } catch (error) {
    console.error('An error occurred in the controller:', error);
    res.status(500).json({ error: error.message || 'Internal server error.' });
  }
}
