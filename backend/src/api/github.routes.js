import { Router } from "express";
import { createRepoAndPushCode } from "./github.controller.js";

const router = Router();

router.post('/create-repo-and-push', createRepoAndPushCode);

export default router;