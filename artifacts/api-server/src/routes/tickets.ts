import { Router } from "express";
import { db, ticketsTable, ticketRepliesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, type AuthRequest } from "../middlewares/authenticate.js";
import { CreateTicketBody, ReplyTicketBody } from "@workspace/api-zod";

const router = Router();

router.get("/", authenticate, async (req: AuthRequest, res) => {
  const tickets = req.userRole === "admin"
    ? await db.select().from(ticketsTable).orderBy(ticketsTable.updatedAt)
    : await db.select().from(ticketsTable).where(eq(ticketsTable.userId, req.userId!));
  res.json(tickets);
});

router.post("/", authenticate, async (req: AuthRequest, res) => {
  const parsed = CreateTicketBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const { subject, department, priority, message } = parsed.data;
  const [ticket] = await db.insert(ticketsTable).values({
    userId: req.userId!,
    subject,
    department,
    priority,
    status: "open",
  }).returning();
  await db.insert(ticketRepliesTable).values({
    ticketId: ticket.id,
    userId: req.userId!,
    message,
    isStaff: false,
  });
  res.status(201).json(ticket);
});

router.get("/:id", authenticate, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id as string);
  const [ticket] = await db.select().from(ticketsTable).where(eq(ticketsTable.id, id)).limit(1);
  if (!ticket || (ticket.userId !== req.userId && req.userRole !== "admin")) {
    res.status(404).json({ error: "Ticket not found" }); return;
  }
  const replies = await db.select().from(ticketRepliesTable).where(eq(ticketRepliesTable.ticketId, id));
  res.json({ ...ticket, replies });
});

router.post("/:id/reply", authenticate, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id as string);
  const parsed = ReplyTicketBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const [ticket] = await db.select().from(ticketsTable).where(eq(ticketsTable.id, id)).limit(1);
  if (!ticket || (ticket.userId !== req.userId && req.userRole !== "admin")) {
    res.status(404).json({ error: "Ticket not found" }); return;
  }
  const isStaff = req.userRole === "admin";
  const [reply] = await db.insert(ticketRepliesTable).values({
    ticketId: id,
    userId: req.userId!,
    message: parsed.data.message,
    isStaff,
  }).returning();
  await db.update(ticketsTable).set({ status: "in_progress", updatedAt: new Date() }).where(eq(ticketsTable.id, id));
  res.status(201).json(reply);
});

router.post("/:id/close", authenticate, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id as string);
  const [ticket] = await db.select().from(ticketsTable).where(eq(ticketsTable.id, id)).limit(1);
  if (!ticket || (ticket.userId !== req.userId && req.userRole !== "admin")) {
    res.status(404).json({ error: "Ticket not found" }); return;
  }
  await db.update(ticketsTable).set({ status: "closed", updatedAt: new Date() }).where(eq(ticketsTable.id, id));
  res.json({ message: "Ticket closed" });
});

export default router;
