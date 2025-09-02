// eslint-disable-next-line no-unused-vars
import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const SideBar = ({ show, onClose, chatHistory }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="sidebar"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed top-0 left-0 h-full w-80 z-50 overflow-y-auto border-r border-white/10
                     bg-black/60 backdrop-blur-xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-black/40">
            <div className="flex items-center space-x-3">

              <div>
                <h2 className="text-lg font-bold text-white">Chat History</h2>
                <p className="text-sm text-gray-400">
                  {chatHistory.length} conversations
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Chat History List */}
          <div className="p-4">
            {chatHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">
                  No conversations yet
                </h3>
                <p className="text-sm text-gray-500">
                  Start a conversation to see your chat history here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {chatHistory.map((chat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative bg-white/5 border border-white/10 rounded-xl p-4 
                               hover:border-green-400/40 hover:shadow-lg hover:shadow-green-500/10 
                               transition-all duration-200 cursor-pointer"
                  >
                    {/* Chat Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-gray-400">
                          Chat #{idx + 1}
                        </span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-gray-400 hover:text-green-400 p-1 rounded">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Prompt */}
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-white mb-1 line-clamp-2">
                        {chat.prompt || "No prompt available"}
                      </h4>
                      <div className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-md">
                        <span className="font-medium text-gray-300">Prompt:</span>{" "}
                        {chat.prompt
                          ? chat.prompt.substring(0, 60) +
                            (chat.prompt.length > 60 ? "..." : "")
                          : "No prompt"}
                      </div>
                    </div>

                    {/* Response Preview */}
                    <div className="border-t border-white/10 pt-3">
                      <div className="text-xs text-gray-400 mb-1">
                        <span className="font-medium text-gray-300">Response:</span>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed">
                        {chat.response
                          ? chat.response.substring(0, 120) +
                            (chat.response.length > 120 ? "..." : "")
                          : "No response available"}
                      </p>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 
                                    rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {chatHistory.length > 0 && (
            <div className="border-t border-white/10 p-4 bg-black/40">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Total conversations: {chatHistory.length}</span>
              
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SideBar;
