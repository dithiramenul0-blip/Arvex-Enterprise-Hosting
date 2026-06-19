import { Router } from "express";
import { db, ordersTable, plansTable, servicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, type AuthRequest } from "../middlewares/authenticate.js";
import { CreateOrderBody } from "@workspace/api-zod";
import { autoProvisionService } from "../lib/provisioner.js";

const router = Router();

router.get("/", authenticate, async (req: AuthRequest, res) => {
  const isAdmin = req.userRole === "admin";
  const rawOrders = isAdmin
    ? await db.select().from(ordersTable)
    : await db.select().from(ordersTable).where(eq(ordersTable.userId, req.userId!));

  const planIds = [...new Set(rawOrders.map(o => o.planId))];
  let planMap = new Map<number, string>();
  for (const pid of planIds) {
    const [p] = await db.select().from(plansTable).where(eq(plansTable.id, pid)).limit(1);
    if (p) planMap.set(p.id, p.name);
  }

  res.json(rawOrders.map(o => ({
    ...o,
    totalPrice: parseFloat(o.totalPrice as unknown as string),
    planName: planMap.get(o.planId) ?? null,
  })));
});

router.post("/", authenticate, async (req: AuthRequest, res) => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const { planId, paymentMethod } = parsed.data;
  const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, planId)).limit(1);
  if (!plan) { res.status(404).json({ error: "Plan not found" }); return; }

  const price = parseFloat(plan.price as unknown as string);
  const [order] = await db.insert(ordersTable).values({
    userId: req.userId!,
    planId,
    status: "active",
    totalPrice: price.toString(),
    paymentMethod,
  }).returning();

  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);
  const [service] = await db.insert(servicesTable).values({
    userId: req.userId!,
    planId,
    status: "active",
    provisionStatus: "pending",
    expiresAt,
  }).returning();

  setImmediate(() => {
    autoProvisionService(service.id).catch(() => {});
  });

  res.status(201).json({
    ...order,
    totalPrice: parseFloat(order.totalPrice as unknown as string),
    planName: plan.name,
  });
});

router.get("/:id", authenticate, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id as string);
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id)).limit(1);
  if (!order || (order.userId !== req.userId && req.userRole !== "admin")) {
    res.status(404).json({ error: "Order not found" }); return;
  }
  const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, order.planId)).limit(1);
  res.json({ ...order, totalPrice: parseFloat(order.totalPrice as unknown as string), planName: plan?.name ?? null });
});

export default router;
