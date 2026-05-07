import mongoose from "mongoose";

export async function connectDb() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/team_task_manager";
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("MongoDB connected");
}
