import { Router } from "express";
import { db, servicesTable, plansTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, requireAdmin, type AuthRequest } from "../middlewares/authenticate.js";

const router = Router();

async function enrichService(svc: typeof servicesTable.$inferSelect) {
  const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, svc.planId)).limit(1);
  return { ...svc, planName: plan?.name ?? null, category: plan?.category ?? null };
}

router.get("/", authenticate, async (req: AuthRequest, res) => {
  const svcs = req.userRole === "admin"
    ? await db.select().from(servicesTable)
    : await db.select().from(servicesTable).where(eq(servicesTable.userId, req.userId!));
  const enriched = await Promise.all(svcs.map(enrichService));
  res.json(enriched);
});

router.get("/:id", authenticate, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const [svc] = await db.select().from(servicesTable).where(eq(servicesTable.id, id)).limit(1);
  if (!svc || (svc.userId !== req.userId && req.userRole !== "admin")) {
    res.status(404).json({ error: "Service not found" }); return;
  }
  res.json(await enrichService(svc));
});

router.post("/:id/suspend", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  await db.update(servicesTable).set({ status: "suspended" }).where(eq(servicesTable.id, id));
  res.json({ message: "Service suspended" });
});

router.post("/:id/unsuspend", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  await db.update(servicesTable).set({ status: "active" }).where(eq(servicesTable.id, id));
  res.json({ message: "Service unsuspended" });
});

router.get("/:id/provision-status", authenticate, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const [svc] = await db.select().from(servicesTable).where(eq(servicesTable.id, id)).limit(1);
  if (!svc || (svc.userId !== req.userId && req.userRole !== "admin")) {
    res.status(404).json({ error: "Service not found" }); return;
  }
  res.json({
    serviceId: svc.id,
    provisionStatus: svc.provisionStatus,
    status: svc.status,
    serverIp: svc.serverIp,
    hostname: svc.hostname,
    consoleUrl: svc.consoleUrl,
    externalId: svc.externalId,
  });
});

export default router;
