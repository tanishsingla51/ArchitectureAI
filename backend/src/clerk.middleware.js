// backend/middleware/clerk.middleware.js
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

/**
 * Clerk middleware to protect routes
 * - Verifies session using Clerk tokens
 * - Attaches auth info (userId, sessionId, orgId) to req.auth
 */
export const clerkMiddleware = ClerkExpressWithAuth({
  onError: (err, req, res, next) => {
    console.error("❌ Clerk Middleware Error:", err.message);
    res.status(401).json({ error: "Unauthorized - Invalid Clerk token" });
  },
  afterAuth: (auth, req, res, next) => {
    if (!auth.userId) {
      console.warn("⚠️ No userId found in request.");
      return res.status(401).json({ error: "Unauthorized - No valid user" });
    }

    // Attach auth info to request for downstream routes

    console.log("✅ Clerk Middleware");  

    req.auth = {
      userId: auth.userId,
      sessionId: auth.sessionId,
      orgId: auth.orgId,
    };

    next();
  },
});
