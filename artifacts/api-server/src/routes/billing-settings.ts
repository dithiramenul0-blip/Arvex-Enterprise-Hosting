import { Router } from "express";
import { db, billingSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, requireAdmin, type AuthRequest } from "../middlewares/authenticate.js";

const router = Router();

async function getAllSettings() {
  const rows = await db.select().from(billingSettingsTable);
  const result: Record<string, string> = {};
  for (const row of rows) {
    result[row.key] = row.value;
  }
  return result;
}

async function upsertSettings(data: Record<string, string>) {
  for (const [key, value] of Object.entries(data)) {
    const existing = await db.select().from(billingSettingsTable).where(eq(billingSettingsTable.key, key)).limit(1);
    if (existing.length > 0) {
      await db.update(billingSettingsTable).set({ value, updatedAt: new Date() }).where(eq(billingSettingsTable.key, key));
    } else {
      await db.insert(billingSettingsTable).values({ key, value });
    }
  }
}

router.get("/admin/billing-settings", authenticate, requireAdmin, async (_req: AuthRequest, res) => {
  const result = await getAllSettings();
  res.json(result);
});

router.put("/admin/billing-settings", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const data = req.body as Record<string, string>;
  if (!data || typeof data !== "object") {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  await upsertSettings(data);
  res.json({ message: "Billing settings updated" });
});

export default router;
