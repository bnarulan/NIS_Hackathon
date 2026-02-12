// contractorRoutes.js placeholder
import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { getTasks, updateTask } from "../controllers/contractorController.js";
import { UPLOAD_DIR } from "../config.js";

const router = Router();

const upload = multer({ dest: UPLOAD_DIR });

router.get(
  "/tasks",
  authMiddleware,
  requireRole("CONTRACTOR"),
  getTasks
);

router.put(
  "/tasks/:postId",
  authMiddleware,
  requireRole("CONTRACTOR"),
  upload.fields([
    { name: "before", maxCount: 1 },
    { name: "after", maxCount: 1 }
  ]),
  updateTask
);

export default router;