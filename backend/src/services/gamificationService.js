// gamificationService.js placeholder
import { prisma } from "../prismaClient.js";

export const POINTS = {
  LIKE: 5,
  COMMENT: 10,
  CLOSE: 30
};

async function addPoints({ userId, postId = null, points, type }) {
  await prisma.$transaction([
    prisma.pointsLog.create({
      data: { userId, postId, type, points }
    }),
    prisma.user.update({
      where: { id: userId },
      data: { points: { increment: points } }
    })
  ]);
}

export async function rewardLike({ userId, postId }) {
  await addPoints({ userId, postId, points: POINTS.LIKE, type: "LIKE" });
}

export async function rewardComment({ userId, postId }) {
  await addPoints({ userId, postId, points: POINTS.COMMENT, type: "COMMENT" });
}

export async function rewardClose({ userId, postId }) {
  await addPoints({ userId, postId, points: POINTS.CLOSE, type: "CLOSE" });
}