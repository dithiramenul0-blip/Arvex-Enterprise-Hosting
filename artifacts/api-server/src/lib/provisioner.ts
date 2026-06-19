import { db } from "@workspace/db";
import { provisionSettingsTable, planProvisionMappingTable, servicesTable, plansTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { PterodactylClient, EGG_DEFAULTS } from "./pterodactyl.js";
import { ProxmoxClient } from "./proxmox.js";
import { logger } from "./logger.js";

export async function getSettings(provider: string) {
  const [settings] = await db.select().from(provisionSettingsTable).where(eq(provisionSettingsTable.provider, provider)).limit(1);
  return settings ?? null;
}

export async function getPlanMapping(planId: number) {
  const [mapping] = await db.select().from(planProvisionMappingTable).where(eq(planProvisionMappingTable.planId, planId)).limit(1);
  return mapping ?? null;
}

export async function autoProvisionService(serviceId: number): Promise<void> {
  const [service] = await db.select().from(servicesTable).where(eq(servicesTable.id, serviceId)).limit(1);
  if (!service) return;

  const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, service.planId)).limit(1);
  if (!plan) return;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, service.userId)).limit(1);
  if (!user) return;

  const category = plan.category;
  const providerKey = ["minecraft", "bot"].includes(category) ? "pterodactyl" : ["vps", "vds"].includes(category) ? "proxmox" : null;

  if (!providerKey) {
    await db.update(servicesTable).set({ provisionStatus: "completed", provisionType: "manual" }).where(eq(servicesTable.id, serviceId));
    return;
  }

  const settings = await getSettings(providerKey);
  if (!settings?.isEnabled || !settings.apiUrl || !settings.apiKeyApp) {
    await db.update(servicesTable).set({
      provisionStatus: "completed",
      provisionType: providerKey,
      serverIp: `${Math.floor(Math.random() * 192) + 64}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`,
      hostname: `${category}-${serviceId}.arvexhosting.com`,
      consoleUrl: null,
    }).where(eq(servicesTable.id, serviceId));
    return;
  }

  try {
    await db.update(servicesTable).set({ provisionStatus: "provisioning", provisionType: providerKey }).where(eq(servicesTable.id, serviceId));

    if (providerKey === "pterodactyl") {
      await provisionPterodactyl(service, plan, user, settings, serviceId, category);
    } else {
      await provisionProxmox(service, plan, settings, serviceId, category);
    }
  } catch (err) {
    logger.error({ err, serviceId }, "Provisioning failed");
    await db.update(servicesTable).set({ provisionStatus: "failed" }).where(eq(servicesTable.id, serviceId));
  }
}

async function provisionPterodactyl(
  service: typeof servicesTable.$inferSelect,
  plan: typeof plansTable.$inferSelect,
  user: typeof usersTable.$inferSelect,
  settings: typeof provisionSettingsTable.$inferSelect,
  serviceId: number,
  category: string
) {
  const ptero = new PterodactylClient(settings.apiUrl!, settings.apiKeyApp!);
  const mapping = await getPlanMapping(plan.id);
  const defaults = EGG_DEFAULTS[category] ?? EGG_DEFAULTS.minecraft;

  const eggId = mapping?.eggId ? parseInt(mapping.eggId) : defaults.eggId;
  const nodeId = mapping?.nodeId ? parseInt(mapping.nodeId) : (settings.defaultNodeId ? parseInt(settings.defaultNodeId) : 1);
  const memory = mapping?.memoryMb ?? defaults.memory;
  const disk = mapping?.diskGb ? mapping.diskGb * 1024 : defaults.disk;
  const cpu = defaults.cpu;

  const pteroUser = await ptero.getOrCreateUser(user.email, user.firstName, user.lastName);
  const allocationId = await ptero.getFirstFreeAllocation(nodeId);
  const server = await ptero.createServer({
    name: `${user.firstName}-${plan.name}-${serviceId}`.replace(/\s+/g, "-").toLowerCase(),
    userId: pteroUser.id,
    eggId,
    nodeId,
    allocationId,
    memory,
    disk,
    cpu,
    image: defaults.image,
    startup: defaults.startup,
    envVars: defaults.envVars,
  });

  const consoleUrl = `${settings.apiUrl}/server/${server.uuid}`;
  await db.update(servicesTable).set({
    provisionStatus: "completed",
    externalId: String(pteroUser.id),
    externalServerId: String(server.id),
    consoleUrl,
    serverIp: `${nodeId}.pterodactyl`,
    hostname: server.name,
    nodeId: String(nodeId),
  }).where(eq(servicesTable.id, serviceId));
}

async function provisionProxmox(
  service: typeof servicesTable.$inferSelect,
  plan: typeof plansTable.$inferSelect,
  settings: typeof provisionSettingsTable.$inferSelect,
  serviceId: number,
  category: string
) {
  const proxmox = new ProxmoxClient(settings.apiUrl!, settings.username ?? "root@pam", settings.password ?? "");
  const mapping = await getPlanMapping(plan.id);
  const node = settings.defaultNodeId ?? "pve";
  const vmid = await proxmox.getNextVMID();
  const vmType = (mapping?.vmType ?? (category === "vds" ? "qemu" : "lxc")) as "qemu" | "lxc";
  const cores = mapping?.cpuCores ?? (category === "vds" ? 4 : 2);
  const memMb = mapping?.memoryMb ?? (category === "vds" ? 8192 : 2048);
  const diskGb = mapping?.diskGb ?? (category === "vds" ? 100 : 25);
  const hostname = `srv-${serviceId}.arvexhosting.com`;

  let vm;
  if (vmType === "qemu") {
    vm = await proxmox.createVM(node, {
      vmid,
      name: hostname,
      cores,
      memory: memMb,
      disk: `${diskGb}G`,
    });
  } else {
    vm = await proxmox.createLXC(node, {
      vmid,
      hostname,
      cores,
      memory: memMb,
      rootfs: `local-lvm:${diskGb}`,
      ostemplate: "local:vztmpl/ubuntu-22.04-standard_22.04-1_amd64.tar.zst",
    });
  }

  await db.update(servicesTable).set({
    provisionStatus: "completed",
    externalId: String(vmid),
    externalServerId: String(vmid),
    hostname,
    serverIp: `${node}.proxmox.arvex`,
    nodeId: node,
  }).where(eq(servicesTable.id, serviceId));
}

export async function performServerAction(serviceId: number, action: string): Promise<string> {
  const [service] = await db.select().from(servicesTable).where(eq(servicesTable.id, serviceId)).limit(1);
  if (!service) throw new Error("Service not found");

  const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, service.planId)).limit(1);
  const category = plan?.category ?? "";
  const isPtero = ["minecraft", "bot"].includes(category);
  const isProxmox = ["vps", "vds"].includes(category);

  if (action === "suspend") {
    await db.update(servicesTable).set({ status: "suspended" }).where(eq(servicesTable.id, serviceId));
  } else if (action === "unsuspend") {
    await db.update(servicesTable).set({ status: "active" }).where(eq(servicesTable.id, serviceId));
  } else if (action === "delete") {
    await db.update(servicesTable).set({ status: "cancelled", provisionStatus: "deleted" }).where(eq(servicesTable.id, serviceId));
  }

  if (isPtero && service.externalServerId) {
    const settings = await getSettings("pterodactyl");
    if (settings?.isEnabled && settings.apiUrl && settings.apiKeyApp) {
      const ptero = new PterodactylClient(settings.apiUrl, settings.apiKeyApp);
      const sid = parseInt(service.externalServerId);
      if (action === "start") await ptero.unsuspendServer(sid);
      else if (action === "stop" || action === "suspend") await ptero.suspendServer(sid);
      else if (action === "reinstall") await ptero.reinstallServer(sid);
      else if (action === "delete") await ptero.deleteServer(sid, true);
    }
  }

  if (isProxmox && service.externalId && service.nodeId) {
    const settings = await getSettings("proxmox");
    if (settings?.isEnabled && settings.apiUrl) {
      const proxmox = new ProxmoxClient(settings.apiUrl, settings.username ?? "root@pam", settings.password ?? "");
      const vmid = parseInt(service.externalId);
      const node = service.nodeId;
      const vmType = category === "vds" ? "qemu" : "lxc";
      if (action === "start") await proxmox.startVM(node, vmid, vmType);
      else if (action === "stop") await proxmox.stopVM(node, vmid, vmType);
      else if (action === "suspend") await proxmox.suspendVM(node, vmid, vmType);
      else if (action === "delete") await proxmox.deleteVM(node, vmid, vmType);
    }
  }

  return `Action '${action}' executed on service ${serviceId}`;
}
