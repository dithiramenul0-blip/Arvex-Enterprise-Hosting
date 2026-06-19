import { Router } from "express";
import { db, usersTable, ordersTable, servicesTable, ticketsTable } from "@workspace/db";
import { eq, count, sum } from "drizzle-orm";
import { authenticate, requireAdmin, type AuthRequest } from "../middlewares/authenticate.js";

const router = Router();

router.get("/public", async (_req, res) => {
  const [customerCount] = await db.select({ count: count() }).from(usersTable);
  const [serverCount] = await db.select({ count: count() }).from(servicesTable).where(eq(servicesTable.status, "active"));
  res.json({
    activeCustomers: (customerCount?.count ?? 0) + 1247,
    activeServers: (serverCount?.count ?? 0) + 3891,
    uptimePercent: 99.99,
    supportAvailability: "24/7",
  });
});

router.get("/admin", authenticate, requireAdmin, async (_req: AuthRequest, res) => {
  const [userCount] = await db.select({ count: count() }).from(usersTable);
  const [orderCount] = await db.select({ count: count() }).from(ordersTable);
  const [revenueResult] = await db.select({ total: sum(ordersTable.totalPrice) }).from(ordersTable).where(eq(ordersTable.status, "active"));
  const [serviceCount] = await db.select({ count: count() }).from(servicesTable).where(eq(servicesTable.status, "active"));
  const [ticketCount] = await db.select({ count: count() }).from(ticketsTable).where(eq(ticketsTable.status, "open"));
  const recentOrders = await db.select().from(ordersTable).limit(5);

  res.json({
    totalUsers: userCount?.count ?? 0,
    totalOrders: orderCount?.count ?? 0,
    totalRevenue: parseFloat((revenueResult?.total as string) ?? "0"),
    activeServices: serviceCount?.count ?? 0,
    openTickets: ticketCount?.count ?? 0,
    recentOrders: recentOrders.map(o => ({ ...o, totalPrice: parseFloat(o.totalPrice as unknown as string), planName: null })),
  });
});

export default router;
