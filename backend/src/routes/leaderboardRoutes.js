// leaderboardRoutes.js placeholder
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getLeaderboard } from "../controllers/leaderboardController.js";

const router = Router();

router.get("/", authMiddleware, getLeaderboard);

export default router;