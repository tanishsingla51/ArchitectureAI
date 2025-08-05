import React from 'react';
import { SignInButton } from '@clerk/clerk-react';

const PopUp = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-75 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-3xl shadow-xl border border-gray-700 p-8 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl text-white">Sign In Required</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p className="text-gray-300 mb-6">
          Please sign in to generate a backend architecture.
        </p>
        <SignInButton mode="modal">
          <button className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-transform transform active:scale-95 shadow-lg">
            Sign In with Google
          </button>
        </SignInButton>
      </div>
    </div>
  );
};

export default PopUp;