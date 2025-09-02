import { Router } from "express";
import { redirectToGithub, githubCallback } from "./auth.controller.js";

const router = Router();

// Step 1: Redirect to GitHub login
router.get("/github" , redirectToGithub);

// Step 2: Handle GitHub OAuth callback
router.get("/github/callback", githubCallback);

export default router;

