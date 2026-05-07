import jwt from "jsonwebtoken";

export function createToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
}
