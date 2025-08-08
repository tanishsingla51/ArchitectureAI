
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const SideBar = ({ show, onClose, chatHistory }) => {
  const [summaries, setSummaries] = useState([]);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const response = await fetch(`${API_URL}/api/get-chat-summary`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompts: chatHistory.map(chat => chat.prompt) }),
        });

        const data = await response.json();
        if (Array.isArray(data.summaries)) {
          setSummaries(data.summaries);
        } else {
          setSummaries([]);
        }
      } catch (error) {
        console.error('Error fetching summaries:', error);
        setSummaries([]);
      }
    };

    if (show && chatHistory.length > 0) {
      fetchSummaries();
    } else {
      setSummaries([]); // Reset when sidebar closes
    }
  }, [show, chatHistory]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="sidebar"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 overflow-y-auto"
        >
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h2 className="text-lg font-bold text-black">Chat History</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
          </div>

          <ul className="p-4 space-y-2 text-black">
            {summaries.map((summary, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer transition-all"
              >
                <p className="font-medium truncate">
                  {summary.prompt ? ` Prompt : ${summary.prompt}` : 'Loading summary...'}
                </p>
                <p className="font-medium truncate">
                  {summary.response ? ` Response : ${summary.response}` : 'Loading response...'} 
                </p>
              </div>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SideBar;
