import express from "express";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.use(protect);

router.get("/", asyncHandler(async (req, res) => {
  const projects = await Project.find({ "members.user": req.user._id });
  const adminProjectIds = projects.filter(project => project.isAdmin(req.user._id)).map(project => project._id);
  const memberProjectIds = projects.filter(project => !project.isAdmin(req.user._id)).map(project => project._id);

  const tasks = await Task.find({
    $or: [
      { project: { $in: adminProjectIds } },
      { project: { $in: memberProjectIds }, assignee: req.user._id }
    ]
  }).populate("assignee", "name email");

  const byStatus = { "To Do": 0, "In Progress": 0, Done: 0 };
  const perUser = {};
  const now = new Date();

  for (const task of tasks) {
    byStatus[task.status] += 1;
    const name = task.assignee?.name || "Unassigned";
    perUser[name] = (perUser[name] || 0) + 1;
  }

  res.json({
    totalTasks: tasks.length,
    byStatus,
    perUser,
    overdueTasks: tasks.filter(task => task.status !== "Done" && task.dueDate < now).length
  });
}));

export default router;
