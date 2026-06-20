import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Send, CheckCircle2, XCircle, MessageSquare, Bell, DollarSign, Server, Ticket, Shield, RefreshCw } from "lucide-react";

interface Webhook {
  id: number;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  lastFired: string;
  fires: number;
}

const ALL_EVENTS = [
  { key: "new_user", label: "New User Registration", icon: CheckCircle2 },
  { key: "new_order", label: "New Order Placed", icon: DollarSign },
  { key: "payment_received", label: "Payment Received", icon: DollarSign },
  { key: "invoice_overdue", label: "Invoice Overdue", icon: Bell },
  { key: "service_provisioned", label: "Service Provisioned", icon: Server },
  { key: "service_suspended", label: "Service Suspended", icon: XCircle },
  { key: "ticket_created", label: "New Support Ticket", icon: Ticket },
  { key: "ticket_replied", label: "Ticket Reply", icon: MessageSquare },
  { key: "ddos_attack", label: "DDoS Attack Detected", icon: Shield },
  { key: "user_banned", label: "User Banned", icon: XCircle },
  { key: "server_down", label: "Server Down Alert", icon: RefreshCw },
  { key: "backup_complete", label: "Backup Complete", icon: CheckCircle2 },
];

const INITIAL: Webhook[] = [
  { id: 1, name: "Main Notifications", url: "https://discord.com/api/webhooks/XXXX/YYYY", events: ["new_user", "new_order", "payment_received"], active: true, lastFired: "2 min ago", fires: 2840 },
  { id: 2, name: "Support Alerts", url: "https://discord.com/api/webhooks/AAAA/BBBB", events: ["ticket_created", "ticket_replied"], active: true, lastFired: "1h ago", fires: 412 },
  { id: 3, name: "Security Alerts", url: "https://discord.com/api/webhooks/CCCC/DDDD", events: ["ddos_attack", "user_banned"], active: true, lastFired: "3d ago", fires: 28 },
];

export default function AdminDiscordWebhooks() {
  const [webhooks, setWebhooks] = useState<Webhook[]>(INITIAL);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", url: "", events: [] as string[] });
  const { toast } = useToast();

  const handleCreate = () => {
    if (!form.name || !form.url) { toast({ title: "Fill in all fields", variant: "destructive" }); return; }
    setWebhooks(prev => [...prev, { ...form, id: Date.now(), active: true, lastFired: "Never", fires: 0 }]);
    setForm({ name: "", url: "", events: [] });
    setShowCreate(false);
    toast({ title: "✅ Webhook added!" });
  };

  const toggleEvent = (key: string) => {
    setForm(f => ({ ...f, events: f.events.includes(key) ? f.events.filter(e => e !== key) : [...f.events, key] }));
  };

  const testWebhook = (wh: Webhook) => {
    toast({ title: `📨 Test payload sent to "${wh.name}"` });
  };

  const toggleActive = (id: number) => setWebhooks(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
  const remove = (id: number) => { setWebhooks(prev => prev.filter(w => w.id !== id)); toast({ title: "Webhook removed." }); };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Discord Webhooks</h1>
          <p className="text-muted-foreground mt-1">Send real-time event notifications to your Discord server.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold">
          <Plus className="w-4 h-4 mr-2" /> Add Webhook
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Webhooks", value: webhooks.length },
          { label: "Active", value: webhooks.filter(w => w.active).length },
          { label: "Total Fires", value: webhooks.reduce((a, w) => a + w.fires, 0).toLocaleString() },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="glass-panel p-5 rounded-2xl text-center">
            <div className="text-3xl font-black text-white">{s.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {showCreate && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 rounded-2xl border-glow">
          <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6">New Webhook</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Webhook Name</label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Support Channel" className="bg-black/50 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Discord Webhook URL</label>
                <Input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://discord.com/api/webhooks/..." className="bg-black/50 border-white/10 text-white font-mono text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 block">Trigger Events</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {ALL_EVENTS.map(ev => {
                  const Icon = ev.icon;
                  const on = form.events.includes(ev.key);
                  return (
                    <button key={ev.key} onClick={() => toggleEvent(ev.key)}
                      className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold text-left transition-all ${on ? "bg-primary/15 border border-primary/30 text-primary" : "bg-white/3 border border-white/5 text-muted-foreground hover:text-white"}`}>
                      <Icon className="w-3.5 h-3.5 shrink-0" />{ev.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={handleCreate} className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold"><Plus className="w-4 h-4 mr-2" /> Add Webhook</Button>
            <Button variant="outline" onClick={() => setShowCreate(false)} className="border-white/10 text-muted-foreground hover:text-white">Cancel</Button>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {webhooks.map((wh, i) => (
          <motion.div key={wh.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="glass-panel p-6 rounded-2xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5865F2]/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-[#5865F2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{wh.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${wh.active ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"}`}>
                      {wh.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="text-muted-foreground text-xs font-mono truncate max-w-[300px] mt-0.5">{wh.url}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right mr-2">
                  <div className="text-xs text-muted-foreground">Last fired: {wh.lastFired}</div>
                  <div className="text-xs text-muted-foreground">{wh.fires.toLocaleString()} total fires</div>
                </div>
                <button onClick={() => testWebhook(wh)} className="text-xs font-bold px-3 py-2 rounded-lg bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2]/20 transition-colors flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" /> Test
                </button>
                <button onClick={() => toggleActive(wh.id)} className={`p-2 rounded-lg transition-colors ${wh.active ? "text-green-400 hover:bg-green-500/10" : "text-muted-foreground hover:bg-white/5"}`}>
                  {wh.active ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </button>
                <button onClick={() => remove(wh.id)} className="text-muted-foreground hover:text-red-400 transition-colors p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {wh.events.map(ev => {
                const e = ALL_EVENTS.find(a => a.key === ev);
                return <span key={ev} className="text-[10px] font-bold text-primary/70 bg-primary/10 px-2 py-1 rounded-full">{e?.label ?? ev}</span>;
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
