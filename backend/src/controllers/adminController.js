// adminController.js placeholder
import { prisma } from "../prismaClient.js";

export async function getAdminStats(req, res, next) {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        lat: true,
        lng: true,
        priorityScore: true,
        status: true,
        createdAt: true
      }
    });

    const reports = await prisma.contractorReport.findMany({
      include: { post: true }
    });

    let totalResolutionMs = 0;
    let resolvedCount = 0;
    for (const r of reports) {
      if (r.completedAt && r.startedAt) {
        totalResolutionMs += r.completedAt.getTime() - r.startedAt.getTime();
        resolvedCount++;
      }
    }

    const avgResolutionHours =
      resolvedCount > 0
        ? totalResolutionMs / resolvedCount / (1000 * 60 * 60)
        : 0;

    const slaBreaches = await prisma.sLA.count({
      where: { breached: true }
    });

    const contractors = await prisma.user.findMany({
      where: { role: "CONTRACTOR" },
      orderBy: { points: "desc" },
      select: { id: true, points: true }
    });

    res.json({
      heatmap: posts,
      avgResolutionHours,
      slaBreaches,
      contractorRanking: contractors
    });
  } catch (e) {
    next(e);
  }
}