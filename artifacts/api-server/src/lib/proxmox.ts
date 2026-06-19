export interface ProxmoxVM {
  vmid: number;
  name: string;
  status: string;
  node: string;
  ip?: string;
}

export class ProxmoxClient {
  private baseUrl: string;
  private username: string;
  private password: string;
  private ticket: string | null = null;
  private csrfToken: string | null = null;
  private ticketExpiry = 0;

  constructor(baseUrl: string, username: string, password: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.username = username;
    this.password = password;
  }

  private async authenticate(): Promise<void> {
    if (this.ticket && Date.now() < this.ticketExpiry) return;
    const res = await fetch(`${this.baseUrl}/api2/json/access/ticket`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username: this.username, password: this.password }),
    });
    if (!res.ok) throw new Error(`Proxmox auth failed: ${res.status}`);
    const data = await res.json() as { data: { ticket: string; CSRFPreventionToken: string } };
    this.ticket = data.data.ticket;
    this.csrfToken = data.data.CSRFPreventionToken;
    this.ticketExpiry = Date.now() + 1000 * 60 * 100;
  }

  private async request(path: string, method = "GET", body?: Record<string, string | number | boolean>) {
    await this.authenticate();
    const res = await fetch(`${this.baseUrl}/api2/json${path}`, {
      method,
      headers: {
        Cookie: `PVEAuthCookie=${this.ticket}`,
        CSRFPreventionToken: this.csrfToken!,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Proxmox API error ${res.status}: ${text}`);
    }
    const json = await res.json() as { data: unknown };
    return json.data;
  }

  async listNodes(): Promise<Array<{ node: string; status: string; cpu: number; mem: number }>> {
    const data = await this.request("/nodes") as unknown[];
    return (data ?? []).map((n: unknown) => {
      const node = n as Record<string, unknown>;
      return { node: node.node as string, status: node.status as string, cpu: node.cpu as number, mem: node.mem as number };
    });
  }

  async getNextVMID(): Promise<number> {
    const id = await this.request("/cluster/nextid");
    return Number(id);
  }

  async createVM(node: string, opts: {
    vmid: number;
    name: string;
    cores: number;
    memory: number;
    disk: string;
    ostype?: string;
    net?: string;
  }): Promise<ProxmoxVM> {
    const body: Record<string, string | number | boolean> = {
      vmid: opts.vmid,
      name: opts.name,
      cores: opts.cores,
      memory: opts.memory,
      ostype: opts.ostype ?? "l26",
      net0: opts.net ?? "virtio,bridge=vmbr0",
      scsi0: `local-lvm:${opts.disk}`,
      scsihw: "virtio-scsi-pci",
      ide2: "local:cloudinit",
      start: 1,
    };
    await this.request(`/nodes/${node}/qemu`, "POST", body);
    return { vmid: opts.vmid, name: opts.name, status: "creating", node };
  }

  async createLXC(node: string, opts: {
    vmid: number;
    hostname: string;
    cores: number;
    memory: number;
    rootfs: string;
    ostemplate: string;
    net?: string;
  }): Promise<ProxmoxVM> {
    const body: Record<string, string | number | boolean> = {
      vmid: opts.vmid,
      hostname: opts.hostname,
      cores: opts.cores,
      memory: opts.memory,
      rootfs: opts.rootfs,
      ostemplate: opts.ostemplate,
      net0: opts.net ?? "name=eth0,bridge=vmbr0,ip=dhcp",
      start: 1,
      unprivileged: 1,
    };
    await this.request(`/nodes/${node}/lxc`, "POST", body);
    return { vmid: opts.vmid, name: opts.hostname, status: "creating", node };
  }

  async startVM(node: string, vmid: number, type: "qemu" | "lxc" = "qemu"): Promise<void> {
    await this.request(`/nodes/${node}/${type}/${vmid}/status/start`, "POST");
  }

  async stopVM(node: string, vmid: number, type: "qemu" | "lxc" = "qemu"): Promise<void> {
    await this.request(`/nodes/${node}/${type}/${vmid}/status/stop`, "POST");
  }

  async suspendVM(node: string, vmid: number, type: "qemu" | "lxc" = "qemu"): Promise<void> {
    if (type === "qemu") await this.request(`/nodes/${node}/${type}/${vmid}/status/suspend`, "POST");
    else await this.stopVM(node, vmid, type);
  }

  async deleteVM(node: string, vmid: number, type: "qemu" | "lxc" = "qemu"): Promise<void> {
    await this.request(`/nodes/${node}/${type}/${vmid}`, "DELETE");
  }

  async getVMStatus(node: string, vmid: number, type: "qemu" | "lxc" = "qemu"): Promise<{ status: string; ip?: string }> {
    try {
      const data = await this.request(`/nodes/${node}/${type}/${vmid}/status/current`) as Record<string, unknown>;
      return { status: data.status as string ?? "unknown" };
    } catch {
      return { status: "unknown" };
    }
  }
}
