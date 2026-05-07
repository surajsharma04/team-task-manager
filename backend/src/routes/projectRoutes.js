import express from "express";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { loadProject, requireAdmin } from "../middleware/projectAccess.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

const populateMembers = query => query.populate("members.user", "name email").populate("createdBy", "name email");

router.use(protect);

router.get("/", asyncHandler(async (req, res) => {
  const projects = await populateMembers(
    Project.find({ "members.user": req.user._id }).sort({ updatedAt: -1 })
  );
  res.json({ projects });
}));

router.post("/", asyncHandler(async (req, res) => {
  const { name, description = "" } = req.body;
  if (!name?.trim()) return res.status(400).json({ message: "Project name is required" });

  const project = await Project.create({
    name: name.trim(),
    description: description.trim(),
    createdBy: req.user._id,
    members: [{ user: req.user._id, role: "Admin" }]
  });

  await project.populate("members.user", "name email");
  await project.populate("createdBy", "name email");
  res.status(201).json({ project });
}));

router.post("/:projectId/members", loadProject, requireAdmin, asyncHandler(async (req, res) => {
  const { email, role = "Member" } = req.body;
  if (!email) return res.status(400).json({ message: "Member email is required" });

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return res.status(404).json({ message: "User not found. Ask them to sign up first." });
  if (req.project.memberFor(user._id)) return res.status(409).json({ message: "User is already a member" });

  req.project.members.push({ user: user._id, role: role === "Admin" ? "Admin" : "Member" });
  await req.project.save();
  await req.project.populate("members.user", "name email");
  res.status(201).json({ project: req.project });
}));

router.delete("/:projectId/members/:userId", loadProject, requireAdmin, asyncHandler(async (req, res) => {
  if (req.project.createdBy.toString() === req.params.userId) {
    return res.status(400).json({ message: "Project creator cannot be removed" });
  }

  req.project.members = req.project.members.filter(member => member.user.toString() !== req.params.userId);
  await req.project.save();
  await Task.deleteMany({ project: req.project._id, assignee: req.params.userId });
  await req.project.populate("members.user", "name email");
  res.json({ project: req.project });
}));

export default router;
