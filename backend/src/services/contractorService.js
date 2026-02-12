// contractorService.js placeholder
import { prisma } from "../prismaClient.js";

export async function getContractorTasks(contractorId) {
  return prisma.post.findMany({
    where: {
      assignedContractorId: contractorId,
      status: { in: ["IN_PROGRESS", "OPEN"] }
    },
    orderBy: { priorityScore: "desc" }
  });
}

export async function updateTaskStatus({
  contractorId,
  postId,
  status,
  beforePhotoUrl,
  afterPhotoUrl
}) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw Object.assign(new Error("Post not found"), { status: 404 });

  const now = new Date();

  const report = await prisma.contractorReport.upsert({
    where: { postId },
    update: {
      contractorId,
      beforePhotoUrl: beforePhotoUrl || undefined,
      afterPhotoUrl: afterPhotoUrl || undefined,
      completedAt: status === "DONE" ? now : null
    },
    create: {
      contractorId,
      postId,
      beforePhotoUrl,
      afterPhotoUrl,
      startedAt: now
    }
  });

  const sla = await prisma.sLA.upsert({
    where: { postId },
    update: {
      resolvedAt: status === "DONE" ? now : null,
      breached:
        status === "DONE" &&
        report.startedAt &&
        now.getTime() - report.startedAt.getTime() >
          (report.targetHours || 24) * 60 * 60 * 1000
          ? true
          : undefined
    },
    create: {
      postId,
      contractorId,
      targetHours: 24
    }
  });

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: { status }
  });

  return { post: updatedPost, report, sla };
}