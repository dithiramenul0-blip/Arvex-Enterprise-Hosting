import { Router } from "express";
import { db, plansTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, requireAdmin, type AuthRequest } from "../middlewares/authenticate.js";
import { CreatePlanBody, UpdatePlanBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const { category } = req.query as { category?: string };
  let query = db.select().from(plansTable);
  const plans = await (category
    ? db.select().from(plansTable).where(eq(plansTable.category, category))
    : query);
  const active = plans.filter(p => p.isActive);
  res.json(active.map(p => ({ ...p, price: parseFloat(p.price as unknown as string) })));
});

router.post("/", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const parsed = CreatePlanBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [plan] = await db.insert(plansTable).values({
    ...parsed.data,
    features: parsed.data.features as string[],
  }).returning();
  res.status(201).json({ ...plan, price: parseFloat(plan.price as unknown as string) });
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, id)).limit(1);
  if (!plan) { res.status(404).json({ error: "Plan not found" }); return; }
  res.json({ ...plan, price: parseFloat(plan.price as unknown as string) });
});

router.patch("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const parsed = UpdatePlanBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const update: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.features) update.features = parsed.data.features as string[];
  const [plan] = await db.update(plansTable).set(update).where(eq(plansTable.id, id)).returning();
  if (!plan) { res.status(404).json({ error: "Plan not found" }); return; }
  res.json({ ...plan, price: parseFloat(plan.price as unknown as string) });
});

router.delete("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  await db.delete(plansTable).where(eq(plansTable.id, id));
  res.json({ message: "Plan deleted" });
});

export default router;
