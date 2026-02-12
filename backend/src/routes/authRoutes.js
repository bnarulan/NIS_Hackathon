// authRoutes.js placeholder
import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { rateLimit } from "../middleware/rateLimitMiddleware.js";

const router = Router();

router.post("/register", rateLimit({ keyPrefix: "rl:auth:", limit: 20 }), register);
router.post("/login", rateLimit({ keyPrefix: "rl:auth:", limit: 30 }), login);

export default router;