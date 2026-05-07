import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["Admin", "Member"], default: "Member" }
  },
  { timestamps: true }
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [memberSchema]
  },
  { timestamps: true }
);

projectSchema.methods.memberFor = function memberFor(userId) {
  const targetId = userId?._id || userId?.id || userId;
  if (!targetId) return null;

  return this.members.find(member => {
    const memberId = member.user?._id || member.user?.id || member.user;
    return memberId?.toString() === targetId.toString();
  }) || null;
};

projectSchema.methods.isAdmin = function isAdmin(userId) {
  return this.memberFor(userId)?.role === "Admin";
};

export default mongoose.model("Project", projectSchema);
