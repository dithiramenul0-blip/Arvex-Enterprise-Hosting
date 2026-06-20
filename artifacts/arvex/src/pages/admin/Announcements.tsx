import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Megaphone, Bell, Globe, Users, AlertCircle, Info, CheckCircle2, XCircle, Eye } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  body: string;
  type: "info" | "warning" | "success" | "error";
  target: "all" | "clients" | "admins";
  placement: "banner" | "popup" | "dashboard";
  active: boolean;
  pinned: boolean;
  createdAt: string;
}

const INITIAL: Announcement[] = [
  { id: 1, title: "🎉 New V2Ray Plans Available!", body: "We've added Hysteria2 and TUIC v5 to our V2Ray plans. Check out the new options!", type: "success", target: "all", placement: "banner", active: true, pinned: true, createdAt: "2025-06-01" },
  { id: 2, title: "Scheduled Maintenance", body: "Maintenance on Frankfurt nodes Jun 22, 02:00–04:00 UTC. Brief interruptions expected.", type: "warning", target: "clients", placement: "banner", active: true, pinned: false, createdAt: "2025-06-18" },
  { id: 3, title: "New Payment Method: Crypto", body: "We now accept USDT, BTC, ETH, and LTC via NOWPayments.", type: "info", target: "all", placement: "dashboard", active: false, pinned: false, createdAt: "2025-05-15" },
];

const TYPE_COLORS = {
  info: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", icon: Info },
  warning: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30", icon: AlertCircle },
  success: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30", icon: CheckCircle2 },
  error: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30", icon: XCircle },
};

export default function AdminAnnouncements() {
  const [items, setItems] = useState<Announcement[]>(INITIAL);
  const [showCreate, setShowCreate] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({ title: "", body: "", type: "info" as Announcement["type"], target: "all" as Announcement["target"], placement: "banner" as Announcement["placement"], pinned: false });

  const handleCreate = () => {
    if (!form.title || !form.body) { toast({ title: "Fill in all fields", variant: "destructive" }); return; }
    const item: Announcement = { ...form, id: Date.now(), active: true, createdAt: new Date().toISOString().split("T")[0] };
    setItems(prev => [item, ...prev]);
    setShowCreate(false);
    toast({ title: "✅ Announcement published!" });
  };

  const toggle = (id: number) => setItems(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  const remove = (id: number) => { setItems(prev => prev.filter(a => a.id !== id)); toast({ title: "Announcement removed." }); };
  const togglePin = (id: number) => setItems(prev => prev.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Announcement Manager</h1>
          <p className="text-muted-foreground mt-1">Publish banners, popups, and dashboard notices to your users.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold">
          <Plus className="w-4 h-4 mr-2" /> New Announcement
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: items.length, icon: Megaphone },
          { label: "Active", value: items.filter(a => a.active).length, icon: Globe },
          { label: "Pinned", value: items.filter(a => a.pinned).length, icon: Bell },
          { label: "Audience Reach", value: "All Users", icon: Users },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="glass-panel p-5 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create form */}
      {showCreate && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 rounded-2xl border-glow">
          <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6">New Announcement</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Title</label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Announcement title" className="bg-black/50 border-white/10 text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Body</label>
              <Textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Announcement details..." className="bg-black/50 border-white/10 text-white min-h-[80px]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["info", "warning", "success", "error"] as const).map(t => (
                    <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                      className={`py-2 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${form.type === t ? "bg-primary text-white" : "bg-white/5 text-muted-foreground hover:text-white"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Target</label>
                <div className="space-y-2">
                  {(["all", "clients", "admins"] as const).map(t => (
                    <button key={t} onClick={() => setForm(f => ({ ...f, target: t }))}
                      className={`w-full py-2 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${form.target === t ? "bg-primary text-white" : "bg-white/5 text-muted-foreground hover:text-white"}`}>
                      {t === "all" ? "All Users" : t === "clients" ? "Clients Only" : "Admins Only"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Placement</label>
                <div className="space-y-2">
                  {(["banner", "popup", "dashboard"] as const).map(p => (
                    <button key={p} onClick={() => setForm(f => ({ ...f, placement: p }))}
                      className={`w-full py-2 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${form.placement === p ? "bg-primary text-white" : "bg-white/5 text-muted-foreground hover:text-white"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.pinned} onChange={e => setForm(f => ({ ...f, pinned: e.target.checked }))} className="w-4 h-4 accent-primary" />
              <span className="text-sm font-medium text-muted-foreground">Pin to top</span>
            </label>
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={handleCreate} className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold">
              <Megaphone className="w-4 h-4 mr-2" /> Publish
            </Button>
            <Button variant="outline" onClick={() => setShowCreate(false)} className="border-white/10 text-muted-foreground hover:text-white">Cancel</Button>
          </div>
        </motion.div>
      )}

      {/* List */}
      <div className="space-y-4">
        {items.map((a, i) => {
          const tc = TYPE_COLORS[a.type];
          const Icon = tc.icon;
          return (
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`glass-panel p-6 rounded-2xl border ${tc.border} relative overflow-hidden`}>
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${tc.bg.replace("bg-", "bg-").replace("/10", "/60")}`} style={{ background: tc.text.replace("text-", "").replace("-400", "") === "blue" ? "rgb(59,130,246)" : tc.text.includes("yellow") ? "rgb(234,179,8)" : tc.text.includes("green") ? "rgb(74,222,128)" : "rgb(248,113,113)" }} />
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-9 h-9 rounded-lg ${tc.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${tc.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-white font-bold">{a.title}</span>
                      {a.pinned && <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">Pinned</span>}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${tc.bg} ${tc.text}`}>{a.type}</span>
                      <span className="text-[10px] font-bold text-muted-foreground/60 bg-white/5 px-2 py-0.5 rounded-full uppercase">{a.placement}</span>
                      <span className="text-[10px] font-bold text-muted-foreground/60 bg-white/5 px-2 py-0.5 rounded-full uppercase">{a.target}</span>
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">{a.body}</p>
                    <p className="text-muted-foreground/50 text-xs mt-2">{a.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => togglePin(a.id)} className={`p-2 rounded-lg transition-colors ${a.pinned ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"}`}>
                    <Bell className="w-4 h-4" />
                  </button>
                  <button onClick={() => toggle(a.id)} className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${a.active ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                    <Eye className="w-3 h-3" />{a.active ? "Live" : "Hidden"}
                  </button>
                  <button onClick={() => remove(a.id)} className="text-muted-foreground hover:text-red-400 transition-colors p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
