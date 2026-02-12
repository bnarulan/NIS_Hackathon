// authMiddleware.js placeholder
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { prisma } from "../prismaClient.js";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}