import React from 'react';
import ChatHistory from '../components/ChatHistory'; // Adjust the path as needed

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold text-gray-800">Chat History</h1>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <ChatHistory />
      </main>
    </div>
  );
}
