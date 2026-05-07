import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
    status: { type: String, enum: ["To Do", "In Progress", "Done"], default: "To Do" },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
