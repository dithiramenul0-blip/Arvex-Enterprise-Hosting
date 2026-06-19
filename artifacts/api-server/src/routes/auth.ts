import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { signToken, hashPassword, verifyPassword, generateToken } from "../lib/auth.js";
import { RegisterBody, LoginBody, ForgotPasswordBody, ResetPasswordBody } from "@workspace/api-zod";
import type { AuthRequest } from "../middlewares/authenticate.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.post("/register", async (req, res) => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { email, password, firstName, lastName } = parsed.data;
  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length > 0) {
    res.status(400).json({ error: "Email already in use" });
    return;
  }
  const hashed = hashPassword(password);
  const [user] = await db.insert(usersTable).values({
    email,
    password: hashed,
    firstName,
    lastName,
    role: "user",
    status: "active",
  }).returning();
  const token = signToken({ userId: user.id, role: user.role });
  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, status: user.status, createdAt: user.createdAt },
  });
});

router.post("/login", async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { email, password } = parsed.data;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user || !verifyPassword(password, user.password)) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  if (user.status === "banned") {
    res.status(401).json({ error: "Account has been banned" });
    return;
  }
  const token = signToken({ userId: user.id, role: user.role });
  res.json({
    token,
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, status: user.status, createdAt: user.createdAt },
  });
});

router.get("/me", authenticate, async (req: AuthRequest, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
  if (!user) { res.status(401).json({ error: "User not found" }); return; }
  res.json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, status: user.status, createdAt: user.createdAt });
});

router.post("/logout", (_req, res) => {
  res.json({ message: "Logged out successfully" });
});

router.post("/forgot-password", async (req, res) => {
  const parsed = ForgotPasswordBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid email" }); return; }
  const { email } = parsed.data;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (user) {
    const token = generateToken();
    const expiry = new Date(Date.now() + 1000 * 60 * 60);
    await db.update(usersTable).set({ resetToken: token, resetTokenExpiry: expiry }).where(eq(usersTable.id, user.id));
  }
  res.json({ message: "If this email is registered, a reset link has been sent" });
});

router.post("/reset-password", async (req, res) => {
  const parsed = ResetPasswordBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const { token, password } = parsed.data;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.resetToken, token)).limit(1);
  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    res.status(400).json({ error: "Invalid or expired reset token" }); return;
  }
  const hashed = hashPassword(password);
  await db.update(usersTable).set({ password: hashed, resetToken: null, resetTokenExpiry: null }).where(eq(usersTable.id, user.id));
  res.json({ message: "Password reset successfully" });
});

export default router;
