import { pgTable, serial, integer, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { plansTable } from "./plans";

export const servicesTable = pgTable("services", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  planId: integer("plan_id").notNull().references(() => plansTable.id),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  serverIp: varchar("server_ip", { length: 100 }),
  hostname: varchar("hostname", { length: 255 }),
  notes: text("notes"),
  provisionType: varchar("provision_type", { length: 20 }),
  provisionStatus: varchar("provision_status", { length: 30 }).notNull().default("pending"),
  externalId: varchar("external_id", { length: 100 }),
  externalServerId: varchar("external_server_id", { length: 100 }),
  consoleUrl: text("console_url"),
  nodeId: varchar("node_id", { length: 100 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertServiceSchema = createInsertSchema(servicesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof servicesTable.$inferSelect;
