// adminRoutes.js placeholder
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { getAdminStats } from "../controllers/adminController.js";

const router = Router();

router.get(
  "/stats",
  authMiddleware,
  requireRole("CONTROLLER"),
  getAdminStats
);

export default router;