


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
  // This new prompt is simplified, direct, and unambiguous.
  const apiPrompt = `
    You are an expert senior backend developer. Your task is to generate the file and code structure for a complete backend application based on the user's request.

    Your response MUST be a single, valid JSON array of objects, and nothing else. Do not include any text, explanation, or markdown formatting outside of the JSON.

    Each object in the array must represent a file and have the following structure:
    - "filePath": A string representing the relative path of the file (e.g., "src/app.js").
    - "content": A string containing the full source code for that file.

    Crucially, the "content" string must be properly escaped to be valid in JSON. Pay special attention to escaping all newline characters as "\\n" and all double quotes as "\\"".

    User's request: "${prompt}"
  `;

  try {
    // IMPORTANT: "gemini-2.5-pro" is not a valid model name.
    // Use a valid model like "gemini-1.5-pro-latest".
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(apiPrompt);
    const response = await result.response;
    // The result should now be a clean JSON string, ready to be parsed.
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // It's helpful to include the error message for better debugging.
    throw new Error(`An error occurred while generating the solution: ${error.message}`);
  }
}
