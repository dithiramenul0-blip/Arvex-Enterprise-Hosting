import { Router } from "express";
import { db, siteSettingsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, requireAdmin, type AuthRequest } from "../middlewares/authenticate.js";

const router = Router();

async function getAllSettings(table: typeof siteSettingsTable) {
  const rows = await db.select().from(table);
  const result: Record<string, string> = {};
  for (const row of rows) {
    result[row.key] = row.value;
  }
  return result;
}

async function upsertSettings(table: typeof siteSettingsTable, data: Record<string, string>) {
  for (const [key, value] of Object.entries(data)) {
    const existing = await db.select().from(table).where(eq(table.key, key)).limit(1);
    if (existing.length > 0) {
      await db.update(table).set({ value, updatedAt: new Date() }).where(eq(table.key, key));
    } else {
      await db.insert(table).values({ key, value });
    }
  }
}

router.get("/site-settings", async (_req, res) => {
  try {
    const result = await getAllSettings(siteSettingsTable);
    res.json(result);
  } catch (err) {
    res.json({});
  }
});

router.get("/admin/site-settings", authenticate, requireAdmin, async (_req: AuthRequest, res) => {
  try {
    const result = await getAllSettings(siteSettingsTable);
    res.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Database error";
    res.status(500).json({ error: `Failed to load settings: ${msg}` });
  }
});

router.put("/admin/site-settings", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const data = req.body as Record<string, string>;
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      res.status(400).json({ error: "Invalid input — expected a JSON object" });
      return;
    }
    await upsertSettings(siteSettingsTable, data);
    res.json({ message: "Site settings updated" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Database error";
    req.log?.error({ err }, "Failed to save site settings");
    res.status(500).json({ error: `Failed to save: ${msg}` });
  }
});

/* ─── First-time admin setup endpoint ─────────────────────────────── */
router.post("/setup-admin", authenticate, async (req: AuthRequest, res) => {
  try {
    const existingAdmins = await db.select().from(usersTable).where(eq(usersTable.role, "admin")).limit(1);
    if (existingAdmins.length > 0) {
      res.status(400).json({ error: "Admin already exists. Contact your existing admin." });
      return;
    }
    const userId = req.userId;
    if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }
    await db.update(usersTable).set({ role: "admin" }).where(eq(usersTable.id, parseInt(userId)));
    res.json({ message: "You are now admin. Please log out and log back in." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    res.status(500).json({ error: msg });
  }
});

export default router;
