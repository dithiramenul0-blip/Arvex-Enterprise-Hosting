import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Trash2, Edit2, Tag, Percent, DollarSign,
  Calendar, Users, CheckCircle2, XCircle, Copy, RefreshCw
} from "lucide-react";

interface Coupon {
  id: number;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  expires: string;
  services: string[];
  active: boolean;
}

const INITIAL_COUPONS: Coupon[] = [
  { id: 1, code: "WELCOME20", type: "percent", value: 20, minOrder: 0, maxUses: 1000, usedCount: 432, expires: "2025-12-31", services: ["All"], active: true },
  { id: 2, code: "VPS50OFF", type: "fixed", value: 5, minOrder: 10, maxUses: 500, usedCount: 89, expires: "2025-09-30", services: ["VPS"], active: true },
  { id: 3, code: "MINECRAFT10", type: "percent", value: 10, minOrder: 0, maxUses: 200, usedCount: 200, expires: "2025-06-01", services: ["Minecraft"], active: false },
  { id: 4, code: "NEWBOT15", type: "percent", value: 15, minOrder: 0, maxUses: 300, usedCount: 67, expires: "2025-11-30", services: ["Bot Hosting"], active: true },
];

const SERVICE_LIST = ["All", "VPS", "Minecraft", "Bot Hosting", "VDS", "Web Hosting", "V2Ray"];

function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const { toast } = useToast();

  const [form, setForm] = useState({
    code: "", type: "percent" as "percent" | "fixed", value: 10,
    minOrder: 0, maxUses: 100, expires: "", services: ["All"] as string[],
  });

  const handleCreate = () => {
    if (!form.code) { toast({ title: "Enter a coupon code", variant: "destructive" }); return; }
    const newCoupon: Coupon = { ...form, id: Date.now(), usedCount: 0, active: true };
    setCoupons(prev => [newCoupon, ...prev]);
    setShowCreate(false);
    setForm({ code: "", type: "percent", value: 10, minOrder: 0, maxUses: 100, expires: "", services: ["All"] });
    toast({ title: "✅ Coupon created!", description: `Code: ${newCoupon.code}` });
  };

  const toggleActive = (id: number) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const deleteCoupon = (id: number) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    toast({ title: "Coupon deleted." });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: `Copied: ${code}` });
  };

  const activeCount = coupons.filter(c => c.active).length;
  const totalUses = coupons.reduce((a, c) => a + c.usedCount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Coupon Manager</h1>
          <p className="text-muted-foreground mt-1">Create and manage discount codes for all services.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold">
          <Plus className="w-4 h-4 mr-2" /> Create Coupon
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Coupons", value: coupons.length, icon: Tag },
          { label: "Active", value: activeCount, icon: CheckCircle2 },
          { label: "Total Uses", value: totalUses, icon: Users },
          { label: "Expired", value: coupons.filter(c => !c.active).length, icon: XCircle },
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

      {/* Create Form */}
      {showCreate && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-2xl border-glow">
          <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6">Create New Coupon</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Coupon Code</label>
              <div className="flex gap-2">
                <Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="e.g. SAVE20" className="bg-black/50 border-white/10 text-white font-mono" />
                <Button variant="outline" onClick={() => setForm(f => ({ ...f, code: generateCode() }))} className="border-white/10 shrink-0">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Discount Type</label>
              <div className="flex rounded-xl overflow-hidden border border-white/10">
                {(["percent", "fixed"] as const).map(t => (
                  <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                    className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${form.type === t ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}>
                    {t === "percent" ? "% Percent" : "$ Fixed"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Value ({form.type === "percent" ? "%" : "$"})
              </label>
              <Input type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))} className="bg-black/50 border-white/10 text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Min Order ($)</label>
              <Input type="number" value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: Number(e.target.value) }))} className="bg-black/50 border-white/10 text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Max Uses</label>
              <Input type="number" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: Number(e.target.value) }))} className="bg-black/50 border-white/10 text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Expiry Date</label>
              <Input type="date" value={form.expires} onChange={e => setForm(f => ({ ...f, expires: e.target.value }))} className="bg-black/50 border-white/10 text-white" />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Applicable Services</label>
              <div className="flex flex-wrap gap-2">
                {SERVICE_LIST.map(svc => (
                  <button key={svc}
                    onClick={() => {
                      if (svc === "All") { setForm(f => ({ ...f, services: ["All"] })); return; }
                      setForm(f => {
                        const next = f.services.filter(s => s !== "All");
                        return { ...f, services: next.includes(svc) ? next.filter(s => s !== svc) : [...next, svc] };
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${form.services.includes(svc) ? "bg-primary text-white" : "bg-white/5 text-muted-foreground hover:text-white"}`}>
                    {svc}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={handleCreate} className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold">
              <Plus className="w-4 h-4 mr-2" /> Create Coupon
            </Button>
            <Button variant="outline" onClick={() => setShowCreate(false)} className="border-white/10 text-muted-foreground hover:text-white">Cancel</Button>
          </div>
        </motion.div>
      )}

      {/* Coupons Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-black/30">
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Code</th>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Discount</th>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Services</th>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Usage</th>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Expires</th>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon, i) => (
                <motion.tr key={coupon.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <code className="text-primary font-black tracking-widest text-sm">{coupon.code}</code>
                      <button onClick={() => copyCode(coupon.code)} className="text-muted-foreground hover:text-white transition-colors">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                      {coupon.type === "percent" ? <Percent className="w-4 h-4 text-primary" /> : <DollarSign className="w-4 h-4 text-green-400" />}
                      {coupon.type === "percent" ? `${coupon.value}%` : `$${coupon.value} off`}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {coupon.services.map(s => (
                        <span key={s} className="text-[10px] font-bold text-primary/70 bg-primary/10 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-white font-medium">{coupon.usedCount} / {coupon.maxUses}</div>
                    <div className="w-20 h-1 bg-white/5 rounded-full mt-1">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (coupon.usedCount / coupon.maxUses) * 100)}%` }} />
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground font-medium">{coupon.expires || "No expiry"}</td>
                  <td className="p-4">
                    <button onClick={() => toggleActive(coupon.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${coupon.active ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                      {coupon.active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {coupon.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-muted-foreground hover:text-primary transition-colors p-1.5">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteCoupon(coupon.id)} className="text-muted-foreground hover:text-red-400 transition-colors p-1.5">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
