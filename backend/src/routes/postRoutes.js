// postRoutes.js placeholder
import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { antiSpamPostMiddleware } from "../middleware/antiSpamMiddleware.js";
import { rateLimit } from "../middleware/rateLimitMiddleware.js";
import {
  getFeed,
  createPostController,
  commentPost,
  likePost
} from "../controllers/postController.js";
import { UPLOAD_DIR } from "../config.js";

const router = Router();

const upload = multer({
  dest: UPLOAD_DIR,
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.get("/", authMiddleware, getFeed);

router.post(
  "/",
  authMiddleware,
  rateLimit({ keyPrefix: "rl:post:", limit: 30 }),
  antiSpamPostMiddleware,
  upload.single("photo"),
  createPostController
);

router.post("/:postId/comments", authMiddleware, commentPost);
router.post("/:postId/likes", authMiddleware, likePost);

export default router;