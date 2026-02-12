// contractorController.js placeholder
import { getContractorTasks, updateTaskStatus } from "../services/contractorService.js";
import { rewardClose } from "../services/gamificationService.js";
import { SOCKET_EVENTS } from "../config.js";

export async function getTasks(req, res, next) {
  try {
    const tasks = await getContractorTasks(req.user.id);
    res.json(tasks);
  } catch (e) {
    next(e);
  }
}

export async function updateTask(req, res, next) {
  try {
    const { postId } = req.params;
    const { status } = req.body;

    if (!["OPEN", "IN_PROGRESS", "DONE"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const beforePhotoUrl = req.files?.before?.[0]
      ? `/uploads/${req.files.before[0].filename}`
      : undefined;
    const afterPhotoUrl = req.files?.after?.[0]
      ? `/uploads/${req.files.after[0].filename}`
      : undefined;

    const { post, report, sla } = await updateTaskStatus({
      contractorId: req.user.id,
      postId: Number(postId),
      status,
      beforePhotoUrl,
      afterPhotoUrl
    });

    if (status === "DONE") {
      await rewardClose({ userId: req.user.id, postId: post.id });
    }

    req.io.emit(SOCKET_EVENTS.CONTRACTOR_TASK_UPDATED, {
      postId: post.id,
      status: post.status,
      contractorId: req.user.id
    });

    res.json({ post, report, sla });
  } catch (e) {
    next(e);
  }
}