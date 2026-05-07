import Project from "../models/Project.js";

export async function loadProject(req, res, next) {
  try {
    const projectId = req.params.projectId || req.body.projectId;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    const member = project.memberFor(req.user._id);
    if (!member) return res.status(403).json({ message: "Project access denied" });
    req.project = project;
    req.projectMember = member;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(req, res, next) {
  if (!req.project.isAdmin(req.user._id)) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}
