import { Router } from "express";
import { db } from "@workspace/db";
import { provisionSettingsTable, planProvisionMappingTable, servicesTable, plansTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, requireAdmin, type AuthRequest } from "../middlewares/authenticate.js";
import { PterodactylClient } from "../lib/pterodactyl.js";
import { performServerAction } from "../lib/provisioner.js";

const router = Router();

async function getOrCreateSettings(provider: string) {
  const [s] = await db.select().from(provisionSettingsTable).where(eq(provisionSettingsTable.provider, provider)).limit(1);
  if (s) return s;
  const [created] = await db.insert(provisionSettingsTable).values({ provider, isEnabled: false }).returning();
  return created;
}

function sanitizeSettings(s: typeof provisionSettingsTable.$inferSelect) {
  return {
    id: s.id,
    provider: s.provider,
    apiUrl: s.apiUrl,
    apiKey: s.apiKey ? "••••••••" : null,
    apiKeyApp: s.apiKeyApp ? "••••••••" : null,
    username: s.username,
    defaultNodeId: s.defaultNodeId,
    defaultEggId: s.defaultEggId,
    isEnabled: s.isEnabled,
    updatedAt: s.updatedAt,
  };
}

router.get("/settings/pterodactyl", authenticate, requireAdmin, async (_req, res) => {
  const s = await getOrCreateSettings("pterodactyl");
  res.json(sanitizeSettings(s));
});

router.put("/settings/pterodactyl", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const body = req.body as Record<string, unknown>;
  const existing = await getOrCreateSettings("pterodactyl");
  const update: Partial<typeof provisionSettingsTable.$inferInsert> = {};
  if (body.apiUrl !== undefined) update.apiUrl = body.apiUrl as string;
  if (body.apiKeyApp !== undefined && body.apiKeyApp !== "••••••••") update.apiKeyApp = body.apiKeyApp as string;
  if (body.apiKey !== undefined && body.apiKey !== "••••••••") update.apiKey = body.apiKey as string;
  if (body.defaultNodeId !== undefined) update.defaultNodeId = body.defaultNodeId as string;
  if (body.defaultEggId !== undefined) update.defaultEggId = body.defaultEggId as string;
  if (body.isEnabled !== undefined) update.isEnabled = body.isEnabled as boolean;
  update.updatedAt = new Date();
  const [s] = await db.update(provisionSettingsTable).set(update).where(eq(provisionSettingsTable.id, existing.id)).returning();
  res.json(sanitizeSettings(s));
});

router.get("/settings/proxmox", authenticate, requireAdmin, async (_req, res) => {
  const s = await getOrCreateSettings("proxmox");
  res.json(sanitizeSettings(s));
});

router.put("/settings/proxmox", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const body = req.body as Record<string, unknown>;
  const existing = await getOrCreateSettings("proxmox");
  const update: Partial<typeof provisionSettingsTable.$inferInsert> = {};
  if (body.apiUrl !== undefined) update.apiUrl = body.apiUrl as string;
  if (body.username !== undefined) update.username = body.username as string;
  if (body.password !== undefined && body.password !== "••••••••") update.password = body.password as string;
  if (body.defaultNodeId !== undefined) update.defaultNodeId = body.defaultNodeId as string;
  if (body.isEnabled !== undefined) update.isEnabled = body.isEnabled as boolean;
  update.updatedAt = new Date();
  const [s] = await db.update(provisionSettingsTable).set(update).where(eq(provisionSettingsTable.id, existing.id)).returning();
  res.json(sanitizeSettings(s));
});

router.get("/pterodactyl/nodes", authenticate, requireAdmin, async (_req, res) => {
  const [settings] = await db.select().from(provisionSettingsTable).where(eq(provisionSettingsTable.provider, "pterodactyl")).limit(1);
  if (!settings?.isEnabled || !settings.apiUrl || !settings.apiKeyApp) {
    res.json([]); return;
  }
  try {
    const ptero = new PterodactylClient(settings.apiUrl, settings.apiKeyApp);
    const nodes = await ptero.listNodes();
    res.json(nodes);
  } catch {
    res.json([]);
  }
});

router.get("/pterodactyl/eggs", authenticate, requireAdmin, async (req, res) => {
  const nestId = req.query.nestId ? parseInt(req.query.nestId as string) : 1;
  const [settings] = await db.select().from(provisionSettingsTable).where(eq(provisionSettingsTable.provider, "pterodactyl")).limit(1);
  if (!settings?.isEnabled || !settings.apiUrl || !settings.apiKeyApp) {
    res.json([]); return;
  }
  try {
    const ptero = new PterodactylClient(settings.apiUrl, settings.apiKeyApp);
    const eggs = await ptero.listEggs(nestId);
    res.json(eggs);
  } catch {
    res.json([]);
  }
});

router.get("/plan-mappings", authenticate, requireAdmin, async (_req, res) => {
  const mappings = await db.select().from(planProvisionMappingTable);
  res.json(mappings);
});

router.put("/plan-mappings/:planId", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const planId = parseInt(req.params.planId as string);
  const body = req.body as Record<string, unknown>;
  const existing = await db.select().from(planProvisionMappingTable).where(eq(planProvisionMappingTable.planId, planId)).limit(1);
  const data = {
    planId,
    provider: body.provider as string,
    nodeId: (body.nodeId as string) || null,
    eggId: (body.eggId as string) || null,
    vmType: (body.vmType as string) || null,
    cpuCores: body.cpuCores ? parseInt(body.cpuCores as string) : null,
    memoryMb: body.memoryMb ? parseInt(body.memoryMb as string) : null,
    diskGb: body.diskGb ? parseInt(body.diskGb as string) : null,
    updatedAt: new Date(),
  };
  if (existing.length > 0) {
    const [updated] = await db.update(planProvisionMappingTable).set(data).where(eq(planProvisionMappingTable.planId, planId)).returning();
    res.json(updated);
  } else {
    const [created] = await db.insert(planProvisionMappingTable).values(data).returning();
    res.json(created);
  }
});

router.get("/provisions", authenticate, requireAdmin, async (_req, res) => {
  const services = await db.select().from(servicesTable);
  const result = await Promise.all(services.map(async svc => {
    const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, svc.planId)).limit(1);
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, svc.userId)).limit(1);
    return {
      serviceId: svc.id,
      userId: svc.userId,
      userEmail: user?.email ?? "",
      planName: plan?.name ?? "",
      category: plan?.category ?? "",
      provisionType: svc.provisionType,
      provisionStatus: svc.provisionStatus,
      externalId: svc.externalId,
      externalServerId: svc.externalServerId,
      serverIp: svc.serverIp,
      hostname: svc.hostname,
      consoleUrl: svc.consoleUrl,
      nodeId: svc.nodeId,
      status: svc.status,
      createdAt: svc.createdAt,
    };
  }));
  res.json(result);
});

router.post("/provisions/:serviceId/action", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const serviceId = parseInt(req.params.serviceId as string);
  const { action } = req.body as { action: string };
  const validActions = ["start", "stop", "restart", "kill", "reinstall", "delete", "suspend", "unsuspend"];
  if (!validActions.includes(action)) {
    res.status(400).json({ error: "Invalid action" }); return;
  }
  const message = await performServerAction(serviceId, action);
  res.json({ message });
});

export default router;
