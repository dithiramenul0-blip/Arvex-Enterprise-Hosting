import { Router } from "express";
import { db, partnersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, requireAdmin, type AuthRequest } from "../middlewares/authenticate.js";
import { CreatePartnerBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (_req, res) => {
  const partners = await db.select().from(partnersTable).orderBy(partnersTable.sortOrder);
  res.json(partners);
});

router.post("/", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const parsed = CreatePartnerBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [partner] = await db.insert(partnersTable).values(parsed.data).returning();
  res.status(201).json(partner);
});

router.delete("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id as string);
  await db.delete(partnersTable).where(eq(partnersTable.id, id));
  res.json({ message: "Partner removed" });
});

export default router;
