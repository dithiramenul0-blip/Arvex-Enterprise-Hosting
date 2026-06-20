import { Router } from "express";
import { db, siteSettingsTable } from "@workspace/db";
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
  const result = await getAllSettings(siteSettingsTable);
  res.json(result);
});

router.get("/admin/site-settings", authenticate, requireAdmin, async (_req: AuthRequest, res) => {
  const result = await getAllSettings(siteSettingsTable);
  res.json(result);
});

router.put("/admin/site-settings", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const data = req.body as Record<string, string>;
  if (!data || typeof data !== "object") {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  await upsertSettings(siteSettingsTable, data);
  res.json({ message: "Site settings updated" });
});

export default router;
