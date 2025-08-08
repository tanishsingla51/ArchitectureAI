// clerk.middleware.js
// src/middleware/clerk.middleware.js

import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

const clerkMiddleware = ClerkExpressWithAuth({
  onError: (err, req, res, next) => {
    console.error('Clerk Middleware Error:', err);
    res.status(401).json({ message: 'Unauthorized - Clerk error' });
  },
  afterAuth: (auth, req, res, next) => {
    if (!auth.userId) {
      return res.status(401).json({ message: 'No user ID found in Clerk auth' });
    }

   // Make userId accessible in route handlers
    req.userId = auth.userId;
    next();
  }
});

export default clerkMiddleware;
