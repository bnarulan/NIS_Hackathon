// leaderboardController.js placeholder
import { prisma } from "../prismaClient.js";

export async function getLeaderboard(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { points: "desc" },
      take: 50,
      select: {
        id: true,
        role: true,
        points: true
      }
    });

    res.json(
      users.map((u, index) => ({
        rank: index + 1,
        userId: u.id,
        role: u.role,
        points: u.points
      }))
    );
  } catch (e) {
    next(e);
  }
}