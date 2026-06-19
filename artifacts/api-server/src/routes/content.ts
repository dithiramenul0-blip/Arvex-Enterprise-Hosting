import { Router } from "express";
import { db, contentPagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, requireAdmin, type AuthRequest } from "../middlewares/authenticate.js";
import { UpdateContentBody } from "@workspace/api-zod";

const router = Router();

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  const [page] = await db.select().from(contentPagesTable).where(eq(contentPagesTable.slug, slug)).limit(1);
  if (!page) { res.status(404).json({ error: "Page not found" }); return; }
  res.json(page);
});

router.put("/:slug", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const { slug } = req.params;
  const parsed = UpdateContentBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const existing = await db.select().from(contentPagesTable).where(eq(contentPagesTable.slug, slug)).limit(1);
  if (existing.length === 0) {
    const [page] = await db.insert(contentPagesTable).values({ slug, ...parsed.data }).returning();
    res.json(page); return;
  }
  const [page] = await db.update(contentPagesTable).set({ ...parsed.data, updatedAt: new Date() }).where(eq(contentPagesTable.slug, slug)).returning();
  res.json(page);
});

export default router;
