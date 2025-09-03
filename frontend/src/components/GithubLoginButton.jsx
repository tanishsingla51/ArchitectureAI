import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import PushCodeButton from "./PushButton";

const GithubLoginButton = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isSignedIn, getToken, userId } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Check GitHub connection status when component mounts
  useEffect(() => {
    if (isSignedIn && userId) {
      checkGithubConnection();
    }
  }, [isSignedIn, userId]);

  // Handle OAuth callback from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loginStatus = params.get("login");
    const error = params.get("error");
    
    if (loginStatus === "success") {
      setIsConnected(true);
      setError(null);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      setError(decodeURIComponent(error));
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const checkGithubConnection = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      
      const response = await fetch(`${API_URL}/api/auth/github/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsConnected(data.connected);
      } else {
        console.error('Failed to check GitHub status');
      }
    } catch (error) {
      console.error('Error checking GitHub connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get Clerk session token
      const token = await getToken();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Store the token in a secure cookie before redirecting
      const response = await fetch(`${API_URL}/api/auth/github/prepare`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          redirectUrl: window.location.origin + window.location.pathname 
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to prepare GitHub authentication');
      }

      // Redirect to your existing GitHub OAuth endpoint
      window.location.href = `${API_URL}/api/auth/github`;
      
    } catch (error) {
      console.error('GitHub login error:', error);
      setError(error.message || 'Failed to connect to GitHub');
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      
      const response = await fetch(`${API_URL}/api/auth/github/disconnect`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setIsConnected(false);
        setError(null);
      } else {
        throw new Error('Failed to disconnect GitHub');
      }
    } catch (error) {
      console.error('GitHub disconnect error:', error);
      setError(error.message || 'Failed to disconnect GitHub');
    } finally {
      setIsLoading(false);
    }
  };

  // Show sign-in prompt if user is not authenticated with Clerk
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
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        {!isConnected ? (
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="flex items-center gap-2 py-1.5 px-3 rounded-md text-xs font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              className={isLoading ? "animate-spin" : ""}
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.94-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            {isLoading ? 'Connecting...' : 'Connect with GitHub'}
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            disabled={isLoading}
            className="flex items-center gap-2 py-1.5 px-3 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
            </svg>
            {isLoading ? 'Disconnecting...' : 'Disconnect'}
          </button>
        )}

        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? "bg-green-500" : "bg-gray-400"
          }`}
          title={isConnected ? "GitHub Connected" : "Not Connected"}
        ></div>

        {isConnected && (
          <div className="text-green-400 text-xs font-medium flex items-center gap-2">
            <span>Connected</span>
            <PushCodeButton />
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="text-red-400 text-xs bg-red-900/20 p-2 rounded border border-red-500/20">
          {error}
        </div>
      )}
    </div>
  );
};

export default GithubLoginButton;