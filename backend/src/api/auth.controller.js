import dotenv from "dotenv";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();

export const redirectToGithub = async (req, res) => {

  const userId = req.auth?.userId;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  // console.log("Authenticated userId from Clerk:", userId);

  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_REDIRECT_URI;
  const scope = "read:user user:email repo";

  if (!clientId || !redirectUri) {
    return res.status(500).json({ error: "Missing GitHub OAuth configuration" });
  }

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}`;

  return res.redirect(githubAuthUrl);
};

export const githubCallback = async (req, res) => {
    try {

      const { code } = req.query;
      const userId = req.auth?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      console.log("Authenticated userId from Clerk:", userId);
  
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
  
      // 4. Update the user in Prisma using the Clerk User ID from the state
    const updatedUser = await prisma.user.update({
      // Use the clerkId (or whatever your foreign key is) which is guaranteed to be unique
      where: { clerkUserId: userId },
      data: {
        githubEmail: email,
        githubId: githubUser.id.toString(), // Ensure IDs are stored as strings if needed
        username: githubUser.login,
        avatarUrl: githubUser.avatar_url,
        githubToken: accessToken, // Consider encrypting this token
      },
    });
  
      // console.log("✅ Updated user with GitHub details:", updatedUser);
  
      // 5. Redirect back to frontend
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?login=success`);
  
    } catch (err) {
      console.error("GitHub callback error:", err.response?.data || err.message);
      return res.status(500).json({ error: "GitHub authentication failed" });
    }
  };
  

