export interface PteroUser {
  id: number;
  username: string;
  email: string;
  uuid: string;
}

export interface PteroServer {
  id: number;
  uuid: string;
  name: string;
  node: string;
  status: string | null;
  allocation: { ip: string; port: number };
}

export interface PteroAllocation {
  id: number;
  ip: string;
  port: number;
  assigned: boolean;
}

export class PterodactylClient {
  private baseUrl: string;
  private appKey: string;

  constructor(baseUrl: string, appKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.appKey = appKey;
  }

  private async appRequest(path: string, method = "GET", body?: unknown): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/application${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.appKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Pterodactyl API error ${res.status}: ${text}`);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  async listNodes(): Promise<Array<{ id: number; name: string; fqdn: string; memory: number; disk: number }>> {
    const data = await this.appRequest("/nodes?include=allocations");
    return (data?.data ?? []).map((n: Record<string, unknown>) => {
      const attrs = n.attributes as Record<string, unknown>;
      const allocs = (attrs.relationships as Record<string, unknown>)?.allocations as Record<string, unknown>;
      return {
        id: attrs.id,
        name: attrs.name,
        fqdn: attrs.fqdn,
        memory: attrs.memory,
        disk: attrs.disk,
        allocations: (allocs?.data as unknown[])?.length ?? 0,
      };
    });
  }

  async listEggs(nestId = 1): Promise<Array<{ id: number; name: string; description: string }>> {
    const data = await this.appRequest(`/nests/${nestId}/eggs`);
    return (data?.data ?? []).map((e: Record<string, unknown>) => {
      const attrs = e.attributes as Record<string, unknown>;
      return { id: attrs.id, name: attrs.name, description: attrs.description };
    });
  }

  async getOrCreateUser(email: string, firstName: string, lastName: string): Promise<PteroUser> {
    const list = await this.appRequest(`/users?filter[email]=${encodeURIComponent(email)}`);
    if (list?.data?.length > 0) {
      const attrs = list.data[0].attributes as Record<string, unknown>;
      return { id: attrs.id as number, username: attrs.username as string, email: attrs.email as string, uuid: attrs.uuid as string };
    }
    const username = email.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 20) + Math.floor(Math.random() * 999);
    const created = await this.appRequest("/users", "POST", {
      email, username,
      first_name: firstName,
      last_name: lastName,
      password: `ArveX_${Math.random().toString(36).slice(2, 12)}!`,
    });
    const attrs = created.attributes as Record<string, unknown>;
    return { id: attrs.id as number, username: attrs.username as string, email: attrs.email as string, uuid: attrs.uuid as string };
  }

  async getFirstFreeAllocation(nodeId: number): Promise<number> {
    const data = await this.appRequest(`/nodes/${nodeId}/allocations`);
    const free = (data?.data ?? []).find((a: Record<string, unknown>) => !(a.attributes as Record<string, unknown>).assigned);
    if (!free) throw new Error("No free allocations on node");
    return (free.attributes as Record<string, unknown>).id as number;
  }

  async createServer(opts: {
    name: string;
    userId: number;
    eggId: number;
    nodeId: number;
    allocationId: number;
    memory: number;
    disk: number;
    cpu: number;
    image: string;
    startup: string;
    envVars?: Record<string, string>;
    featureLimits?: { databases: number; backups: number };
  }): Promise<PteroServer> {
    const body = {
      name: opts.name,
      user: opts.userId,
      egg: opts.eggId,
      docker_image: opts.image,
      startup: opts.startup,
      environment: opts.envVars ?? {},
      limits: { memory: opts.memory, swap: 0, disk: opts.disk, io: 500, cpu: opts.cpu },
      feature_limits: opts.featureLimits ?? { databases: 1, backups: 2 },
      allocation: { default: opts.allocationId },
      start_on_completion: true,
    };
    const data = await this.appRequest("/servers", "POST", body);
    const attrs = data.attributes as Record<string, unknown>;
    return {
      id: attrs.id as number,
      uuid: attrs.uuid as string,
      name: attrs.name as string,
      node: String(attrs.node),
      status: attrs.status as string | null,
      allocation: { ip: "auto", port: 0 },
    };
  }

  async suspendServer(serverId: number): Promise<void> {
    await this.appRequest(`/servers/${serverId}/suspend`, "POST");
  }

  async unsuspendServer(serverId: number): Promise<void> {
    await this.appRequest(`/servers/${serverId}/unsuspend`, "POST");
  }

  async reinstallServer(serverId: number): Promise<void> {
    await this.appRequest(`/servers/${serverId}/reinstall`, "POST");
  }

  async deleteServer(serverId: number, force = false): Promise<void> {
    await this.appRequest(`/servers/${serverId}${force ? "/force" : ""}`, "DELETE");
  }

  async getServer(serverId: number): Promise<{ status: string; uuid: string } | null> {
    try {
      const data = await this.appRequest(`/servers/${serverId}`);
      const attrs = data.attributes as Record<string, unknown>;
      return { status: attrs.status as string ?? "running", uuid: attrs.uuid as string };
    } catch {
      return null;
    }
  }
}

export const EGG_DEFAULTS: Record<string, { eggId: number; memory: number; disk: number; cpu: number; image: string; startup: string; envVars: Record<string, string> }> = {
  minecraft: {
    eggId: 1,
    memory: 2048,
    disk: 10240,
    cpu: 100,
    image: "ghcr.io/pterodactyl/yolks:java_21",
    startup: "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}",
    envVars: { SERVER_JARFILE: "server.jar", MC_VERSION: "latest", SERVER_MEMORY: "2048" },
  },
  bot: {
    eggId: 15,
    memory: 512,
    disk: 5120,
    cpu: 50,
    image: "ghcr.io/pterodactyl/yolks:nodejs_18",
    startup: "if [[ -d .git ]]; then git pull; fi; if [[ ! -f package.json ]]; then echo 'no pkg'; exit 1; fi; npm install; node {{MAIN_FILE}}",
    envVars: { MAIN_FILE: "index.js" },
  },
};
