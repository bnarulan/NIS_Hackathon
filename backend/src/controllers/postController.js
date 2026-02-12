// postController.js placeholder
import { prisma } from "../prismaClient.js";
import { createPost, recalcPriorityForPost } from "../services/postService.js";
import { rewardComment, rewardLike } from "../services/gamificationService.js";
import { SOCKET_EVENTS } from "../config.js";

export async function getFeed(req, res, next) {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { priorityScore: "desc" },
      include: {
        _count: { select: { comments: true, likes: true } }
      }
    });

    const data = posts.map((p) => ({
      id: p.id,
      category: p.category,
      description: p.description,
      lat: p.lat,
      lng: p.lng,
      photoUrl: p.photoUrl,
      priorityScore: p.priorityScore,
      status: p.status,
      createdAt: p.createdAt,
      commentsCount: p._count.comments,
      likesCount: p._count.likes
    }));

    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function createPostController(req, res, next) {
  try {
    const { category, description, lat, lng } = req.body;

    if (!category || !description) {
      return res.status(400).json({ error: "Category and description required" });
    }

    const latNum = lat != null ? Number(lat) : null;
    const lngNum = lng != null ? Number(lng) : null;

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const created = await createPost({
      userId: req.user.id,
      category,
      description,
      lat: latNum,
      lng: lngNum,
      photoUrl
    });

    req.io.emit(SOCKET_EVENTS.POST_CREATED, {
      id: created.id,
      category: created.category,
      description: created.description,
      lat: created.lat,
      lng: created.lng,
      photoUrl: created.photoUrl,
      priorityScore: created.priorityScore,
      status: created.status,
      createdAt: created.createdAt
    });

    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
}

export async function commentPost(req, res, next) {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const existing = await prisma.comment.findFirst({
      where: { postId: Number(postId), userId }
    });

    if (existing) {
      return res
        .status(400)
        .json({ error: "You have already commented on this post" });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        postId: Number(postId),
        userId
      }
    });

    await rewardComment({ userId, postId: Number(postId) });
    const updatedPost = await recalcPriorityForPost(Number(postId));

    req.io.emit(SOCKET_EVENTS.POST_COMMENTED, {
      postId: Number(postId),
      commentCountIncrement: 1,
      priorityScore: updatedPost.priorityScore
    });

    res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
}

export async function likePost(req, res, next) {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const existing = await prisma.like.findFirst({
      where: { postId: Number(postId), userId }
    });

    if (existing) {
      return res.status(400).json({ error: "You already liked this post" });
    }

    const like = await prisma.like.create({
      data: {
        postId: Number(postId),
        userId
      }
    });

    await rewardLike({ userId, postId: Number(postId) });
    const updatedPost = await recalcPriorityForPost(Number(postId));

    req.io.emit(SOCKET_EVENTS.POST_LIKED, {
      postId: Number(postId),
      likeCountIncrement: 1,
      priorityScore: updatedPost.priorityScore
    });

    res.status(201).json(like);
  } catch (e) {
    next(e);
  }
}