import express from "express";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { protect } from "../middleware/auth.js";
import { loadProject, requireAdmin } from "../middleware/projectAccess.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.use(protect);

router.get("/project/:projectId", loadProject, asyncHandler(async (req, res) => {
  const query = { project: req.project._id };
  if (!req.project.isAdmin(req.user._id)) query.assignee = req.user._id;
  const tasks = await Task.find(query).populate("assignee", "name email").populate("createdBy", "name email").sort({ dueDate: 1 });
  res.json({ tasks });
}));

router.post("/", loadProject, requireAdmin, asyncHandler(async (req, res) => {
  const { title, description = "", dueDate, priority, assignee } = req.body;
  if (!title || !dueDate || !priority || !assignee) {
    return res.status(400).json({ message: "Title, due date, priority, and assignee are required" });
  }
  if (!req.project.memberFor(assignee)) return res.status(400).json({ message: "Assignee must be a project member" });
  if (Number.isNaN(new Date(dueDate).getTime())) return res.status(400).json({ message: "Due date is invalid" });

  const task = await Task.create({
    project: req.project._id,
    title: title.trim(),
    description: description.trim(),
    dueDate,
    priority,
    assignee,
    createdBy: req.user._id
  });

  await task.populate("assignee", "name email");
  await task.populate("createdBy", "name email");
  res.status(201).json({ task });
}));

router.patch("/:taskId", asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: "Task not found" });

  const project = await Project.findById(task.project);
  if (!project?.memberFor(req.user._id)) return res.status(403).json({ message: "Task access denied" });

  const admin = project.isAdmin(req.user._id);
  const assigned = task.assignee.toString() === req.user._id.toString();
  if (!admin && !assigned) return res.status(403).json({ message: "Only admins or assigned members can update this task" });

  const allowedForMember = ["status"];
  if (!admin && Object.keys(req.body).some(key => !allowedForMember.includes(key))) {
    return res.status(403).json({ message: "Members can update status only" });
  }

  const fields = admin ? ["title", "description", "dueDate", "priority", "status", "assignee"] : ["status"];
  for (const field of fields) {
    if (req.body[field] !== undefined) task[field] = typeof req.body[field] === "string" ? req.body[field].trim() : req.body[field];
  }
  if (task.assignee && !project.memberFor(task.assignee)) {
    return res.status(400).json({ message: "Assignee must be a project member" });
  }
  if (task.dueDate && Number.isNaN(new Date(task.dueDate).getTime())) {
    return res.status(400).json({ message: "Due date is invalid" });
  }

  await task.save();
  await task.populate("assignee", "name email");
  await task.populate("createdBy", "name email");
  res.json({ task });
}));

router.delete("/:taskId", asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: "Task not found" });

  const project = await Project.findById(task.project);
  if (!project?.isAdmin(req.user._id)) return res.status(403).json({ message: "Admin access required" });

  await task.deleteOne();
  res.json({ ok: true });
}));

export default router;
