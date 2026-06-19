import { pgTable, serial, varchar, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const provisionSettingsTable = pgTable("provision_settings", {
  id: serial("id").primaryKey(),
  provider: varchar("provider", { length: 30 }).notNull().unique(),
  apiUrl: text("api_url"),
  apiKey: text("api_key"),
  apiKeyApp: text("api_key_app"),
  username: varchar("username", { length: 100 }),
  password: text("password"),
  defaultNodeId: varchar("default_node_id", { length: 50 }),
  defaultEggId: varchar("default_egg_id", { length: 50 }),
  defaultAllocId: varchar("default_alloc_id", { length: 50 }),
  isEnabled: boolean("is_enabled").notNull().default(false),
  extraConfig: text("extra_config"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const planProvisionMappingTable = pgTable("plan_provision_mapping", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id").notNull(),
  provider: varchar("provider", { length: 30 }).notNull(),
  nodeId: varchar("node_id", { length: 50 }),
  eggId: varchar("egg_id", { length: 50 }),
  vmType: varchar("vm_type", { length: 20 }),
  cpuCores: integer("cpu_cores"),
  memoryMb: integer("memory_mb"),
  diskGb: integer("disk_gb"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertProvisionSettingsSchema = createInsertSchema(provisionSettingsTable).omit({ id: true, updatedAt: true });
export const insertPlanProvisionMappingSchema = createInsertSchema(planProvisionMappingTable).omit({ id: true, updatedAt: true });
export type InsertProvisionSettings = z.infer<typeof insertProvisionSettingsSchema>;
export type ProvisionSettings = typeof provisionSettingsTable.$inferSelect;
export type PlanProvisionMapping = typeof planProvisionMappingTable.$inferSelect;
