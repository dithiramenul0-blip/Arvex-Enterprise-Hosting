import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, type AuthRequest } from "../middlewares/authenticate.js";
import { UpdateProfileBody, ChangePasswordBody } from "@workspace/api-zod";
import { hashPassword, verifyPassword } from "../lib/auth.js";

const router = Router();

router.patch("/profile", authenticate, async (req: AuthRequest, res) => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [user] = await db.update(usersTable).set(parsed.data).where(eq(usersTable.id, req.userId!)).returning();
  res.json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, status: user.status, createdAt: user.createdAt });
});

router.post("/change-password", authenticate, async (req: AuthRequest, res) => {
  const parsed = ChangePasswordBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const { currentPassword, newPassword } = parsed.data;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
  if (!user || !verifyPassword(currentPassword, user.password)) {
    res.status(400).json({ error: "Current password is incorrect" }); return;
  }
  const hashed = hashPassword(newPassword);
  await db.update(usersTable).set({ password: hashed }).where(eq(usersTable.id, req.userId!));
  res.json({ message: "Password changed successfully" });
});

export default router;
