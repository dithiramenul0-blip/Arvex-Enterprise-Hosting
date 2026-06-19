import { Router } from "express";
import { db, usersTable, servicesTable, plansTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, requireAdmin, type AuthRequest } from "../middlewares/authenticate.js";
import { AdminUpdateUserBody } from "@workspace/api-zod";

const router = Router();

router.get("/users", authenticate, requireAdmin, async (_req, res) => {
  const users = await db.select().from(usersTable);
  res.json(users.map(u => ({ id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, role: u.role, status: u.status, createdAt: u.createdAt })));
});

router.patch("/users/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id as string);
  const parsed = AdminUpdateUserBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [user] = await db.update(usersTable).set(parsed.data).where(eq(usersTable.id, id)).returning();
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  res.json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, status: user.status, createdAt: user.createdAt });
});

router.post("/users/:id/ban", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id as string);
  await db.update(usersTable).set({ status: "banned" }).where(eq(usersTable.id, id));
  res.json({ message: "User banned" });
});

router.get("/services", authenticate, requireAdmin, async (_req, res) => {
  const svcs = await db.select().from(servicesTable);
  const enriched = await Promise.all(svcs.map(async svc => {
    const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, svc.planId)).limit(1);
    return { ...svc, planName: plan?.name ?? null, category: plan?.category ?? null };
  }));
  res.json(enriched);
});

export default router;
