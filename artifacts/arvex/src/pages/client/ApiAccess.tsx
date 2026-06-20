import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Code, Plus, Trash2, Eye, EyeOff, Copy, RefreshCw, CheckCircle2, Clock, Globe, Zap } from "lucide-react";
import { ClientLayout } from "@/components/ClientLayout";

interface ApiKey {
  id: number;
  name: string;
  key: string;
  permissions: string[];
  created: string;
  lastUsed: string;
  requests: number;
  active: boolean;
}

const INITIAL_KEYS: ApiKey[] = [
  { id: 1, name: "Production App", key: "arvex_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6", permissions: ["read:services", "read:invoices", "create:tickets"], created: "2025-05-15", lastUsed: "2 min ago", requests: 8420, active: true },
  { id: 2, name: "Monitoring Bot", key: "arvex_live_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4", permissions: ["read:services", "read:servers"], created: "2025-06-01", lastUsed: "1h ago", requests: 3150, active: true },
];

const ALL_PERMS = [
  { key: "read:services", label: "Read Services" },
  { key: "read:invoices", label: "Read Invoices" },
  { key: "read:tickets", label: "Read Tickets" },
  { key: "create:tickets", label: "Create Tickets" },
  { key: "read:servers", label: "Read Servers" },
  { key: "manage:servers", label: "Manage Servers" },
  { key: "read:profile", label: "Read Profile" },
];

function maskKey(key: string) {
  return key.slice(0, 16) + "•".repeat(20) + key.slice(-6);
}

export default function ClientApiAccess() {
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
  const [showCreate, setShowCreate] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState<Set<number>>(new Set());
  const [form, setForm] = useState({ name: "", permissions: [] as string[] });
  const { toast } = useToast();

  const toggleReveal = (id: number) => {
    setRevealedKeys(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: "API key copied to clipboard." });
  };

  const handleCreate = () => {
    if (!form.name) { toast({ title: "Enter a name for this key", variant: "destructive" }); return; }
    if (form.permissions.length === 0) { toast({ title: "Select at least one permission", variant: "destructive" }); return; }
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const randomStr = Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    const newKey: ApiKey = {
      id: Date.now(), name: form.name, key: `arvex_live_${randomStr}`,
      permissions: form.permissions, created: new Date().toISOString().split("T")[0],
      lastUsed: "Never", requests: 0, active: true,
    };
    setKeys(prev => [newKey, ...prev]);
    setRevealedKeys(prev => new Set([...prev, newKey.id]));
    setForm({ name: "", permissions: [] });
    setShowCreate(false);
    toast({ title: "✅ API key created!", description: "Copy it now — it won't be shown again in full." });
  };

  const revokeKey = (id: number) => {
    setKeys(prev => prev.filter(k => k.id !== id));
    toast({ title: "API key revoked." });
  };

  return (
    <ClientLayout>
      <div className="space-y-8 max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">API Access</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage API keys to integrate ArveX with your applications.</p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold">
            <Plus className="w-4 h-4 mr-2" /> Create API Key
          </Button>
        </div>

        {/* Docs quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Globe, title: "REST API", desc: "Full API reference with endpoints and examples.", href: "#" },
            { icon: Zap, title: "Webhooks", desc: "Receive real-time event notifications.", href: "#" },
            { icon: Code, title: "SDK / Libraries", desc: "Node.js, Python, PHP client libraries.", href: "#" },
          ].map((d, i) => {
            const Icon = d.icon;
            return (
              <motion.a key={i} href={d.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="glass-panel p-5 rounded-2xl flex items-start gap-3 hover:border-primary/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{d.title}</div>
                  <div className="text-muted-foreground text-xs mt-0.5">{d.desc}</div>
                </div>
              </motion.a>
            );
          })}
        </div>

        {showCreate && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 rounded-2xl border-glow">
            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6">Create API Key</h3>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Key Name</label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. My App, Discord Bot" className="bg-black/50 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 block">Permissions</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {ALL_PERMS.map(p => {
                    const on = form.permissions.includes(p.key);
                    return (
                      <button key={p.key}
                        onClick={() => setForm(f => ({ ...f, permissions: on ? f.permissions.filter(x => x !== p.key) : [...f.permissions, p.key] }))}
                        className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold text-left transition-all ${on ? "bg-primary/15 border border-primary/30 text-primary" : "bg-white/3 border border-white/5 text-muted-foreground hover:text-white"}`}>
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${on ? "opacity-100" : "opacity-30"}`} />
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={handleCreate} className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold"><Plus className="w-4 h-4 mr-2" /> Generate Key</Button>
              <Button variant="outline" onClick={() => setShowCreate(false)} className="border-white/10 text-muted-foreground">Cancel</Button>
            </div>
          </motion.div>
        )}

        {/* API Keys */}
        <div className="space-y-4">
          {keys.map((k, i) => (
            <motion.div key={k.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="glass-panel p-6 rounded-2xl">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold">{k.name}</span>
                    <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" /> Created {k.created} · Last used {k.lastUsed} · {k.requests.toLocaleString()} requests
                  </div>
                </div>
                <button onClick={() => revokeKey(k.id)} className="flex items-center gap-1.5 text-xs font-bold text-red-400/60 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/10">
                  <Trash2 className="w-3.5 h-3.5" /> Revoke
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <code className="flex-1 text-sm font-mono bg-black/40 border border-white/5 rounded-lg px-4 py-3 text-primary/80 truncate">
                  {revealedKeys.has(k.id) ? k.key : maskKey(k.key)}
                </code>
                <button onClick={() => toggleReveal(k.id)} className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                  {revealedKeys.has(k.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => copyKey(k.key)} className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {k.permissions.map(p => (
                  <span key={p} className="text-[10px] font-bold text-primary/70 bg-primary/10 px-2 py-1 rounded-full font-mono">{p}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Base URL */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-sm font-black text-white uppercase tracking-tight mb-4">API Endpoint</h3>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm font-mono bg-black/40 border border-white/5 rounded-lg px-4 py-3 text-primary/80">
              https://arvex.host/api/v1
            </code>
            <button onClick={() => { navigator.clipboard.writeText("https://arvex.host/api/v1"); toast({ title: "Copied!" }); }}
              className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <p className="text-muted-foreground text-xs mt-3">Include your API key in the Authorization header: <code className="text-primary">Authorization: Bearer YOUR_API_KEY</code></p>
        </div>
      </div>
    </ClientLayout>
  );
}
