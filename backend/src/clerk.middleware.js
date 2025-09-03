// backend/middleware/clerk.middleware.js
import { verifyToken } from '@clerk/backend';

/**
 * Clerk middleware that works with cookies
 */
export const clerkMiddleware = async (req, res, next) => {
  try {
    // console.log("🔍 All cookies:", Object.keys(req.cookies || {}));
    
    // Look for session tokens in cookies
    let sessionToken = null;
    
    // Check for main session cookie
    if (req.cookies?.__session) {
      sessionToken = req.cookies.__session;
      // console.log("📝 Found __session cookie");
    }
    
    // If no main session, look for instance-specific session cookies
    if (!sessionToken) {
      const sessionCookies = Object.keys(req.cookies || {})
        .filter(key => key.startsWith('__session_'))
        .map(key => req.cookies[key]);
      
      if (sessionCookies.length > 0) {
        sessionToken = sessionCookies[0]; // Use the first one found
        // console.log("📝 Found instance-specific session cookie");
      }
    }
    
    // Fallback to Authorization header
    const authHeader = req.headers.authorization;
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    const token = sessionToken || headerToken;
    
    if (!token) {
      // console.log("🔓 No token found - treating as unauthenticated");
      req.auth = { userId: null, sessionId: null };
      return next();
    }

    // console.log("🔑 Token found, verifying...");

    // Verify the token
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

     console.log("✅ Clerk Middleware - Token verified for user:", payload.sub);
    
    // Attach auth info to request
    req.auth = {
      userId: payload.sub,
      sessionId: payload.sid,
      orgId: payload.org_id,
    };

    next();
  } catch (error) {
    console.error("❌ Clerk Middleware Error:", error.message);
    console.error("❌ Full error:", error);
    req.auth = { userId: null, sessionId: null };
    next(); // Continue without blocking - let individual routes decide
  }
};
