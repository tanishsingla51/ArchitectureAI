

import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey);

// This is the core function that generates content from a prompt.
export async function generateContentFromPrompt(prompt) {
  // We specify the prompt with instructions for the AI to generate a backend.
  // This new prompt is more complex, asking for a structured response.
  const apiPrompt = `
    You are a senior backend developer. Your task is to generate a complete backend application with a clear file structure based on the user's prompt.

    Please follow these instructions carefully:
    1. First, provide a file structure layout in Markdown, using tree-like formatting.
    2. After the file structure, provide the code for each file, with the file path clearly labeled as a Markdown heading (e.g., ### src/index.js).
    3. For each code block, use the appropriate language syntax highlighting (e.g., \`\`\`javascript).
    4. The server must use the frameworks and technologies mentioned in the user's prompt.
    5. The response should be a single, complete Markdown document. Do not include any conversational text outside of the file labels and code blocks.

    User's prompt: "${prompt}"
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });
    const result = await model.generateContent(apiPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error('An error occurred while generating the solution.');
  }
}

