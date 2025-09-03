import { Router } from "express";
import { redirectToGithub, githubCallback , checkGithubStatus, prepareAuth, disconnectGithub } from "./auth.controller.js";

const router = Router();

router.get("/github/status", checkGithubStatus);

// Prepare auth (store token temporarily before redirect)  
router.post("/github/prepare", prepareAuth);

// Disconnect GitHub
router.delete("/github/disconnect", disconnectGithub);

// Step 1: Redirect to GitHub login
router.get("/github" , redirectToGithub);

// Step 2: Handle GitHub OAuth callback
router.get("/github/callback", githubCallback);

export default router;

