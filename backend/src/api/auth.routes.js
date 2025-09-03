import { Router } from "express";
import { redirectToGithub, githubCallback , checkGithubStatus,disconnectGithub } from "./auth.controller.js";
import { requireAuth } from "../clerk.middleware.js";

const router = Router();

router.get("/github/status", requireAuth, checkGithubStatus);

// Disconnect GitHub
router.delete("/github/disconnect", requireAuth, disconnectGithub);

// Step 1: Redirect to GitHub login
router.get("/github" , redirectToGithub);

// Step 2: Handle GitHub OAuth callback
router.get("/github/callback", githubCallback);

export default router;

