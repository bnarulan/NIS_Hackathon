// antiSpamMiddleware.js placeholder
import { prisma } from "../prismaClient.js";
import { MAX_POSTS_PER_DAY } from "../config.js";

export async function antiSpamPostMiddleware(req, res, next) {
  try {
    const userId = req.user.id;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const postCountToday = await prisma.post.count({
      where: {
        userId,
        createdAt: { gte: todayStart }
      }
    });

    if (postCountToday >= MAX_POSTS_PER_DAY) {
      return res
        .status(429)
        .json({ error: `Max ${MAX_POSTS_PER_DAY} posts per day reached` });
    }

    const { description } = req.body;
    if (description) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const duplicate = await prisma.post.findFirst({
        where: {
          userId,
          description,
          createdAt: { gte: oneHourAgo }
        }
      });
      if (duplicate) {
        return res.status(400).json({ error: "Duplicate content detected" });
      }
    }

    next();
  } catch (e) {
    next(e);
  }
}