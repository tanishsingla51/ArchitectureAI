// src/middleware/clerk.middleware.js

import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

// Get Clerk Secret Key from environment variables.
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!CLERK_SECRET_KEY) {
  throw new Error("Missing CLERK_SECRET_KEY in your .env file.");
}

// Create the Clerk Express middleware using the correct function.
const clerkMiddleware = ClerkExpressWithAuth({
  secretKey: CLERK_SECRET_KEY
});

// Export the middleware for use in the main server file.
export default clerkMiddleware;