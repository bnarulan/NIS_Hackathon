// postService.js placeholder
import { prisma } from "../prismaClient.js";
import { analyzeText, calculatePriority } from "./aiService.js";

export async function createPost({
  userId,
  category,
  description,
  lat,
  lng,
  photoUrl
}) {
  const { dangerLevel, computeLocationWeight } = analyzeText(description);
  const locationWeight = computeLocationWeight(lat, lng);

  const post = await prisma.post.create({
    data: {
      userId,
      category,
      description,
      lat,
      lng,
      photoUrl,
      dangerLevel,
      locationWeight,
      status: "OPEN",
      priorityScore: 0
    }
  });

  const withCounts = await prisma.post.findUnique({
    where: { id: post.id },
    include: {
      _count: { select: { comments: true, likes: true } }
    }
  });

  const priorityScore = calculatePriority({
    likes: withCounts._count.likes,
    comments: withCounts._count.comments,
    dangerLevel,
    locationWeight,
    daysOpen: 0
  });

  return prisma.post.update({
    where: { id: post.id },
    data: { priorityScore }
  });
}

export async function recalcPriorityForPost(postId) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      _count: { select: { comments: true, likes: true } }
    }
  });

  if (!post) return null;

  const daysOpen = Math.max(
    0,
    Math.floor((Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60 * 24))
  );

  const priorityScore = calculatePriority({
    likes: post._count.likes,
    comments: post._count.comments,
    dangerLevel: post.dangerLevel,
    locationWeight: post.locationWeight,
    daysOpen
  });

  return prisma.post.update({
    where: { id: postId },
    data: { priorityScore }
  });
}