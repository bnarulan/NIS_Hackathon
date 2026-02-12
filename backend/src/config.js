import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;

export const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
export const JWT_EXPIRES_IN = "7d";

export const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://govtech:govtechpass@postgres:5432/govtech_db?schema=public";

export const REDIS_URL = process.env.REDIS_URL || "redis://redis:6379";

export const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
export const MAX_POSTS_PER_DAY = 3;

export const SOCKET_EVENTS = {
  POST_CREATED: "post:created",
  POST_UPDATED: "post:updated",
  POST_LIKED: "post:liked",
  POST_COMMENTED: "post:commented",
  CONTRACTOR_TASK_UPDATED: "contractor:taskUpdated"
};