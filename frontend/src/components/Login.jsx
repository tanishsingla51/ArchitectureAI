import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const Login = () => {
  return (
    <div className="flex items-center space-x-4">
      {/* Renders sign-in button when the user is signed out */}
      <SignedOut>
        <SignInButton mode="modal">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg transition-colors">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
      {/* Renders user button when the user is signed in */}
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default Login;