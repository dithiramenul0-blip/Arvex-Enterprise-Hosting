import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Shield, Plus, Trash2, Edit2, Users, CheckCircle2, XCircle, Lock, Eye, Save } from "lucide-react";

interface Permission {
  key: string;
  label: string;
  group: string;
}

interface Role {
  id: number;
  name: string;
  color: string;
  description: string;
  permissions: string[];
  userCount: number;
  system?: boolean;
}

const ALL_PERMISSIONS: Permission[] = [
  { key: "view_dashboard", label: "View Dashboard", group: "Admin" },
  { key: "manage_users", label: "Manage Users", group: "Admin" },
  { key: "ban_users", label: "Ban/Suspend Users", group: "Admin" },
  { key: "manage_plans", label: "Manage Plans", group: "Admin" },
  { key: "manage_services", label: "Manage Services", group: "Admin" },
  { key: "view_analytics", label: "View Analytics", group: "Admin" },
  { key: "manage_coupons", label: "Manage Coupons", group: "Billing" },
  { key: "view_invoices", label: "View All Invoices", group: "Billing" },
  { key: "issue_refunds", label: "Issue Refunds", group: "Billing" },
  { key: "manage_billing", label: "Billing Settings", group: "Billing" },
  { key: "manage_tickets", label: "Manage Tickets", group: "Support" },
  { key: "reply_tickets", label: "Reply to Tickets", group: "Support" },
  { key: "close_tickets", label: "Close Tickets", group: "Support" },
  { key: "manage_partners", label: "Manage Partners", group: "Content" },
  { key: "manage_content", label: "Content CMS", group: "Content" },
  { key: "site_settings", label: "Site Customizer", group: "Content" },
  { key: "manage_announcements", label: "Announcements", group: "Content" },
  { key: "manage_roles", label: "Manage Roles", group: "System" },
  { key: "audit_logs", label: "View Audit Logs", group: "System" },
  { key: "manage_webhooks", label: "Discord Webhooks", group: "System" },
  { key: "maintenance_mode", label: "Maintenance Mode", group: "System" },
  { key: "pterodactyl", label: "Pterodactyl Panel", group: "Hosting" },
  { key: "proxmox", label: "Proxmox Panel", group: "Hosting" },
  { key: "provision_servers", label: "Provision Servers", group: "Hosting" },
];

const GROUPS = [...new Set(ALL_PERMISSIONS.map(p => p.group))];

const INITIAL_ROLES: Role[] = [
  { id: 1, name: "Super Admin", color: "#7c3aed", description: "Full access to everything. Cannot be modified.", permissions: ALL_PERMISSIONS.map(p => p.key), userCount: 1, system: true },
  { id: 2, name: "Admin", color: "#e11d48", description: "Standard admin with most permissions.", permissions: ["view_dashboard","manage_users","manage_plans","manage_services","view_analytics","manage_coupons","view_invoices","manage_tickets","reply_tickets","close_tickets","manage_partners","manage_content","site_settings","manage_announcements","pterodactyl","proxmox","provision_servers"], userCount: 3 },
  { id: 3, name: "Support", color: "#0891b2", description: "Can only handle support tickets.", permissions: ["view_dashboard","manage_tickets","reply_tickets","close_tickets"], userCount: 5 },
  { id: 4, name: "Billing", color: "#16a34a", description: "Billing and invoice management.", permissions: ["view_dashboard","manage_coupons","view_invoices","issue_refunds","manage_billing"], userCount: 2 },
];

export default function AdminRoles() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [selected, setSelected] = useState<Role | null>(null);
  const [editing, setEditing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newColor, setNewColor] = useState("#7c3aed");
  const { toast } = useToast();

  const togglePerm = (key: string) => {
    if (!selected || selected.system) return;
    setSelected(r => r ? { ...r, permissions: r.permissions.includes(key) ? r.permissions.filter(p => p !== key) : [...r.permissions, key] } : r);
  };

  const handleSave = () => {
    if (!selected) return;
    setRoles(prev => prev.map(r => r.id === selected.id ? selected : r));
    setEditing(false);
    toast({ title: "✅ Role saved!" });
  };

  const handleCreate = () => {
    if (!newName) { toast({ title: "Enter a role name", variant: "destructive" }); return; }
    const role: Role = { id: Date.now(), name: newName, color: newColor, description: newDesc, permissions: [], userCount: 0 };
    setRoles(prev => [...prev, role]);
    setShowCreate(false);
    setNewName(""); setNewDesc(""); setNewColor("#7c3aed");
    toast({ title: "✅ Role created!" });
  };

  const deleteRole = (id: number) => {
    setRoles(prev => prev.filter(r => r.id !== id));
    if (selected?.id === id) setSelected(null);
    toast({ title: "Role deleted." });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground mt-1">Define access levels for your admin team.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold">
          <Plus className="w-4 h-4 mr-2" /> New Role
        </Button>
      </div>

      {showCreate && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-2xl border-glow">
          <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">Create Role</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Role name" className="bg-black/50 border-white/10 text-white" />
            <Input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description" className="bg-black/50 border-white/10 text-white" />
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Color:</label>
              <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)} className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90 text-white font-bold"><Plus className="w-4 h-4 mr-2" /> Create</Button>
            <Button variant="outline" onClick={() => setShowCreate(false)} className="border-white/10 text-muted-foreground">Cancel</Button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role list */}
        <div className="space-y-2">
          {roles.map((role, i) => (
            <motion.button key={role.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              onClick={() => { setSelected(role); setEditing(false); }}
              className={`w-full glass-panel p-4 rounded-xl text-left transition-all hover:border-primary/30 ${selected?.id === role.id ? "border-glow" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                  <div>
                    <div className="text-white font-bold text-sm">{role.name}</div>
                    <div className="text-muted-foreground text-xs flex items-center gap-1"><Users className="w-3 h-3" /> {role.userCount} users</div>
                  </div>
                </div>
                {!role.system && (
                  <button onClick={e => { e.stopPropagation(); deleteRole(role.id); }} className="text-muted-foreground hover:text-red-400 transition-colors p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="text-xs text-muted-foreground/60 mt-2">{role.permissions.length} permissions</div>
            </motion.button>
          ))}
        </div>

        {/* Permission editor */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="glass-panel p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: selected.color + "30" }}>
                    <Shield className="w-5 h-5" style={{ color: selected.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase">{selected.name}</h3>
                    <p className="text-muted-foreground text-xs">{selected.description}</p>
                  </div>
                </div>
                {!selected.system && (
                  <div className="flex gap-2">
                    {!editing ? (
                      <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-white/5 text-muted-foreground hover:text-white">
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                    ) : (
                      <button onClick={handleSave} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-primary text-white">
                        <Save className="w-3.5 h-3.5" /> Save
                      </button>
                    )}
                  </div>
                )}
                {selected.system && <span className="text-xs font-bold text-primary/70 bg-primary/10 px-3 py-1.5 rounded-full flex items-center gap-1"><Lock className="w-3 h-3" /> System Role</span>}
              </div>

              <div className="space-y-6">
                {GROUPS.map(group => (
                  <div key={group}>
                    <div className="text-xs font-bold text-primary/70 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <div className="h-px flex-1 bg-primary/10" />{group}<div className="h-px flex-1 bg-primary/10" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {ALL_PERMISSIONS.filter(p => p.group === group).map(perm => {
                        const has = selected.permissions.includes(perm.key);
                        return (
                          <button
                            key={perm.key}
                            onClick={() => editing && togglePerm(perm.key)}
                            disabled={selected.system || !editing}
                            className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${has ? "bg-primary/10 border border-primary/20" : "bg-white/2 border border-white/5"} ${editing && !selected.system ? "cursor-pointer hover:border-primary/40" : "cursor-default"}`}
                          >
                            {has ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> : <XCircle className="w-4 h-4 text-muted-foreground/30 shrink-0" />}
                            <span className={`text-xs font-medium ${has ? "text-white" : "text-muted-foreground"}`}>{perm.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl text-center flex flex-col items-center justify-center h-full">
              <Shield className="w-12 h-12 text-primary/30 mb-4" />
              <p className="text-muted-foreground font-medium">Select a role to manage its permissions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
