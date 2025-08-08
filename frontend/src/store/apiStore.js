// src/store/apiStore.js

import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// This store centralizes all the state and actions related to our API calls.
const useApiStore = create((set, get) => ({
  // --- State Variables ---
  prompt: '',
  solution: '',
  isLoading: false,
  isCopied: false,
  error: null,
  isFallback: false,
  isChatHistoryLoading: false,
  isChatHistoryBarOpen: false,
  chatHistory: [],
  selectedChat: null,
  setSelectedChat: (chat) => set({ selectedChat: chat }),

  // --- Actions (Functions to modify state) ---

  // Updates the prompt state as the user types.
  setPrompt: (newPrompt) => set({ prompt: newPrompt }),

  // Handles the entire API call flow. It takes the getToken function from Clerk.
  generateSolution: async (getToken) => {
    const { prompt } = get(); // Get the current prompt from the store.
    if (!prompt) return;

    set({
      isLoading: true,
      solution: '',
      error: null,
      isCopied: false,
      isFallback: false,
    });

    try {
      // Get the session token from Clerk for a secure request.
      const token = await getToken();



      const response = await fetch(`${API_URL}/api/generate-solution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error types and throw a new error with a user-friendly message.
        if (response.status === 503) {
          throw new Error('The AI service is currently overloaded. Please try again in a few moments.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
        } else if (response.status === 401) {
          throw new Error('Authentication failed. Please check your API configuration.');
        } else if (response.status === 400) {
          throw new Error('Invalid request. Please check your prompt and try again.');
        } else {
          throw new Error(data.error || 'Failed to generate solution. Please try again.');
        }
      }

      // Update the state with the new solution.
      set({
        solution: data.solution,
        isFallback: data.fallback || false,
      });

    } catch (err) {
      console.error('API Error:', err);
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Handles copying the solution to the clipboard.
  handleCopy: () => {
    const { solution } = get();
    navigator.clipboard.writeText(solution)
      .then(() => {
        set({ isCopied: true });
        setTimeout(() => set({ isCopied: false }), 2000);
      })
      .catch(err => {
        console.error("Failed to copy text: ", err);
      });
  },

  getChatHistory: async (getToken) => {

    set({ isChatHistoryLoading: true });

    const token = await getToken();


    const response = await fetch(`${API_URL}/api/get-chat-history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Fetching from:', `${API_URL}/api/get-chat-history`);

    const data = await response.json();
    set({ chatHistory: data });
    set({ isChatHistoryLoading: false });

  },
}));

export default useApiStore;
