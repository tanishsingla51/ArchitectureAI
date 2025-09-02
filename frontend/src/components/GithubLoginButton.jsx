import React, { useEffect, useState } from "react";
// Correcting the import to use a CDN, which resolves the module resolution error.
import { useAuth } from "@clerk/clerk-react";

import PushCodeButton from "./PushButton";

const GithubLoginButton = () => {
  const [isConnected, setIsConnected] = useState(false);
  // This now uses Clerk's actual authentication state
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") === "success") {
      setIsConnected(true);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleLogin = () => {
    // This URL is correct and points to your backend to initiate the flow.
    const backendUrl = "http://localhost:8000/api/auth/github";
    console.log(`Attempting to navigate to: ${backendUrl}`);
    window.location.href = backendUrl;
  };

  // Only render this button if the user is actually signed in with Clerk
  if (!isSignedIn) {
    return (
      <div className="flex items-center space-x-2">
        <div
          className="w-3 h-3 rounded-full bg-gray-400"
          title="Not Connected"
        ></div>
        <span className="text-xs text-gray-400">
          Please sign in to connect GitHub.
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {!isConnected && (
        <button
          onClick={handleLogin}
          className="flex items-center gap-2 py-1.5 px-3 rounded-md text-xs font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.94-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          Connect with GitHub
        </button>
      )}

      <div
        className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-gray-400"}`}
        title={isConnected ? "GitHub Connected" : "Not Connected"}
      ></div>

      {isConnected && (
        <div className="text-green-400 text-xs font-medium flex items-center gap-2">
          <span>Connected</span>
          <PushCodeButton />
        </div>
      )}
    </div>
  );
};

export default GithubLoginButton;
