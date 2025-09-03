import dotenv from "dotenv";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { verifyToken } from "@clerk/backend";

dotenv.config();
const prisma = new PrismaClient();

// Store for temporary auth states (use Redis in production)
const authStates = new Map();

// Add these functions to your existing auth.controller.js:

// Check if user has GitHub connected
export const checkGithubStatus = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Check if user has GitHub token in database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { 
        githubToken: true,
        githubId: true,
        username: true
      }
    });

    const connected = !!(user && user.githubToken && user.githubId);
    
    res.json({ 
      connected,
      username: user?.username || null
    });
  } catch (error) {
    console.error('Error checking GitHub status:', error);
    res.status(500).json({ error: 'Failed to check GitHub status' });
  }
};

// Disconnect GitHub
export const disconnectGithub = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Remove GitHub data from user
    await prisma.user.update({
      where: { clerkUserId: userId },
      data: {
        githubEmail: null,
        githubId: null,
        username: null,
        avatarUrl: null,
        githubToken: null,
      },
    });

    res.json({ 
      success: true, 
      message: 'GitHub disconnected successfully' 
    });
  } catch (error) {
    console.error('Error disconnecting GitHub:', error);
    res.status(500).json({ error: 'Failed to disconnect GitHub' });
  }
};

export const redirectToGithub = async (req, res) => {
  try {
    console.log("hello from redirect to github");
    
    // Get token and redirectUrl from query parameters
    const { token, redirectUrl } = req.query;
    let userId = null;

    // Verify the token if provided
    if (token) {
      try {
        const payload = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY,
        });
        userId = payload.sub;
        console.log("✅ Token verified, userId:", userId);
      } catch (error) {
        console.error("❌ Token verification failed:", error);
        return res.status(401).json({ error: "Invalid token" });
      }
    } else {
      // Fallback to middleware auth
      userId = req.auth?.userId;
    }

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    console.log("userId from redirect to github:", userId);

    // Generate state and store user context
    const state = generateRandomState();
    authStates.set(state, {
      userId,
      redirectUrl: redirectUrl ? decodeURIComponent(redirectUrl) : process.env.FRONTEND_URL,
      timestamp: Date.now()
    });

    // Clean up old states
    cleanupOldStates();

    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_REDIRECT_URI;
    const scope = "read:user user:email repo";

    if (!clientId || !redirectUri) {
      return res.status(500).json({ error: "Missing GitHub OAuth configuration" });
    }

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}&state=${state}`;

    return res.redirect(githubAuthUrl);

  } catch (error) {
    console.error("Error in redirectToGithub:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Updated githubCallback to handle state
export const githubCallback = async (req, res) => {
  try {
    const { code, state, error } = req.query;
    
    if (error) {
      console.error("GitHub OAuth error:", error);
      return res.redirect(`${process.env.FRONTEND_URL}?error=${encodeURIComponent(error)}`);
    }

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}?error=${encodeURIComponent('No authorization code received')}`);
    }

    // Get user context from state
    let userId;
    let redirectUrl = process.env.FRONTEND_URL;
    
    if (state && authStates.has(state)) {
      const authState = authStates.get(state);
      userId = authState.userId;
      redirectUrl = authState.redirectUrl;
      authStates.delete(state); // Clean up used state
    } else {
      // Fallback - this shouldn't happen in normal flow
      console.warn("No state found in callback, this might be an issue");
      return res.redirect(`${process.env.FRONTEND_URL}?error=${encodeURIComponent('Invalid authentication state')}`);
    }

    console.log("Authenticated userId from stored state:", userId);

    // 1. Exchange code for access token
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenRes.data.access_token;

    // 2. Fetch GitHub user info
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const githubUser = userRes.data;
    console.log("GitHub User:", githubUser);

    // 3. Fetch email if missing
    let email = githubUser.email;
    if (!email) {
      const emailRes = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const primaryEmail = emailRes.data.find((e) => e.primary) || emailRes.data[0];
      email = primaryEmail?.email;
    }

    // 4. Update the user in Prisma
    const updatedUser = await prisma.user.update({
      where: { clerkUserId: userId },
      data: {
        githubEmail: email,
        githubId: githubUser.id.toString(),
        username: githubUser.login,
        avatarUrl: githubUser.avatar_url,
        githubToken: accessToken, // Consider encrypting this token
      },
    });

    console.log("✅ Updated user with GitHub details:", updatedUser);

    // 5. Clear the auth state cookie
    res.clearCookie('github_auth_state');
    
    // 6. Redirect back to frontend with success
    const finalRedirectUrl = new URL(redirectUrl);
    finalRedirectUrl.searchParams.set('login', 'success');
    return res.redirect(finalRedirectUrl.toString());

  } catch (err) {
    console.error("GitHub callback error:", err.response?.data || err.message);
    return res.redirect(`${process.env.FRONTEND_URL}?error=${encodeURIComponent('GitHub authentication failed')}`);
  }
};

// Helper functions
function generateRandomState() {
  return crypto.randomBytes(32).toString('hex');
}

function cleanupOldStates() {
  const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
  for (const [key, value] of authStates.entries()) {
    if (value.timestamp < tenMinutesAgo) {
      authStates.delete(key);
    }
  }
}