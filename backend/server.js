import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Load environment variables from .env file
dotenv.config();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API endpoint for generating solutions
app.post('/api/generate-solution', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Generating solution for prompt:', prompt);

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `You are an expert backend developer. Create a complete, structured backend application based on this request: ${prompt}. 
      
      Provide a detailed response including:
      1. Project structure
      2. Required dependencies
      3. Complete code files
      4. Setup instructions
      5. API endpoints documentation
      
      Format your response in Markdown with proper code blocks.`,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking for faster response
        },
      }
    });

    const solution = response.text;
    console.log('Solution generated successfully');
    
    res.json({ solution });

  } catch (error) {
    console.error('Error generating solution:', error);
    res.status(500).json({ 
      error: 'Failed to generate solution',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/generate-solution`);
}); 