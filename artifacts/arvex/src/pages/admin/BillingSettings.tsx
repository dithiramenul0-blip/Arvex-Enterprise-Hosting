import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, CreditCard, Bitcoin, Save, CheckCircle2, XCircle, ToggleLeft, ToggleRight, Globe, Percent, Clock } from "lucide-react";

interface Gateway {
  id: string;
  name: string;
  logo: string;
  enabled: boolean;
  fee: string;
  currencies: string[];
  apiKey: string;
  secretKey: string;
  mode: "test" | "live";
}

const GATEWAYS: Gateway[] = [
  { id: "stripe", name: "Stripe", logo: "💳", enabled: true, fee: "2.9% + $0.30", currencies: ["USD", "EUR", "GBP"], apiKey: "pk_live_xxx...", secretKey: "sk_live_xxx...", mode: "live" },
  { id: "paypal", name: "PayPal", logo: "🅿️", enabled: true, fee: "3.49% + fixed fee", currencies: ["USD", "EUR", "GBP", "CAD"], apiKey: "client_id_xxx...", secretKey: "secret_xxx...", mode: "live" },
  { id: "crypto", name: "Crypto (NOWPayments)", logo: "₿", enabled: true, fee: "0.5%", currencies: ["BTC", "ETH", "USDT", "LTC"], apiKey: "api_key_xxx...", secretKey: "", mode: "live" },
  { id: "wise", name: "Wise", logo: "💸", enabled: false, fee: "0.5–2%", currencies: ["USD", "EUR", "GBP"], apiKey: "", secretKey: "", mode: "test" },
  { id: "payoneer", name: "Payoneer", logo: "🏦", enabled: false, fee: "3%", currencies: ["USD", "EUR"], apiKey: "", secretKey: "", mode: "test" },
  { id: "bank", name: "Bank Transfer", logo: "🏛️", enabled: true, fee: "None", currencies: ["USD", "EUR", "GBP"], apiKey: "", secretKey: "", mode: "live" },
];

const BILLING_CONFIG = {
  taxEnabled: true,
  taxRate: "0",
  taxLabel: "VAT",
  invoiceDueDays: 7,
  gracePeriodDays: 3,
  suspendAfterDays: 14,
  terminateAfterDays: 30,
  autoRenewalEnabled: true,
  renewalReminderDays: [7, 3, 1],
  currency: "USD",
  currencySymbol: "$",
};

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex items-center gap-3 transition-colors">
      {checked ? <ToggleRight className="w-8 h-8 text-primary" /> : <ToggleLeft className="w-8 h-8 text-muted-foreground/40" />}
      <span className={`text-sm font-medium ${checked ? "text-white" : "text-muted-foreground"}`}>{label}</span>
    </button>
  );
}

export default function AdminBillingSettings() {
  const [gateways, setGateways] = useState<Gateway[]>(GATEWAYS);
  const [config, setConfig] = useState(BILLING_CONFIG);
  const [selected, setSelected] = useState<Gateway | null>(null);
  const { toast } = useToast();

  const toggleGateway = (id: string) => setGateways(prev => prev.map(g => g.id === id ? { ...g, enabled: !g.enabled } : g));
  const setMode = (id: string, mode: "test" | "live") => setGateways(prev => prev.map(g => g.id === id ? { ...g, mode } : g));
  const handleSave = () => { toast({ title: "✅ Billing settings saved!" }); };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Billing Manager</h1>
          <p className="text-muted-foreground mt-1">Configure payment gateways, tax, invoicing, and auto-renewal.</p>
        </div>
        <Button onClick={handleSave} className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold">
          <Save className="w-4 h-4 mr-2" /> Save Settings
        </Button>
      </div>

      {/* Payment Gateways */}
      <div className="glass-panel p-8 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-black text-white uppercase">Payment Gateways</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gateways.map((gw, i) => (
            <motion.div key={gw.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`glass-panel p-5 rounded-2xl cursor-pointer transition-all hover:border-primary/30 ${selected?.id === gw.id ? "border-glow" : ""} ${gw.enabled ? "" : "opacity-60"}`}
              onClick={() => setSelected(gw)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{gw.logo}</div>
                  <div>
                    <div className="text-white font-bold">{gw.name}</div>
                    <div className="text-muted-foreground text-xs">{gw.fee}</div>
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); toggleGateway(gw.id); }}
                  className="transition-colors">
                  {gw.enabled ? <ToggleRight className="w-7 h-7 text-primary" /> : <ToggleLeft className="w-7 h-7 text-muted-foreground/40" />}
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {gw.currencies.map(c => <span key={c} className="text-[10px] font-bold text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">{c}</span>)}
              </div>
              <div className="flex items-center justify-between">
                <div className={`text-[10px] font-bold px-2 py-1 rounded-full ${gw.enabled ? "text-green-400 bg-green-500/10" : "text-muted-foreground bg-white/5"}`}>
                  {gw.enabled ? "● Active" : "○ Disabled"}
                </div>
                <div className="flex rounded-lg overflow-hidden border border-white/10">
                  {(["test", "live"] as const).map(m => (
                    <button key={m} onClick={e => { e.stopPropagation(); setMode(gw.id, m); }}
                      className={`px-2 py-1 text-[10px] font-bold uppercase transition-colors ${gw.mode === m ? "bg-primary text-white" : "text-muted-foreground"}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selected && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4">
            <h4 className="text-sm font-black text-white uppercase">Configure: {selected.name}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">API Key / Client ID</label>
                <Input defaultValue={selected.apiKey} placeholder="Enter API key..." type="password" className="bg-black/50 border-white/10 text-white font-mono text-sm" />
              </div>
              {selected.secretKey !== undefined && (
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Secret Key</label>
                  <Input defaultValue={selected.secretKey} placeholder="Enter secret..." type="password" className="bg-black/50 border-white/10 text-white font-mono text-sm" />
                </div>
              )}
            </div>
            <Button onClick={() => { setSelected(null); toast({ title: `✅ ${selected.name} configured!` }); }} className="bg-primary hover:bg-primary/90 text-white font-bold">
              <Save className="w-4 h-4 mr-2" /> Save Configuration
            </Button>
          </motion.div>
        )}
      </div>

      {/* Billing Config */}
      <div className="glass-panel p-8 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-black text-white uppercase">Invoice & Auto-Renewal Settings</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Toggle checked={config.autoRenewalEnabled} onChange={v => setConfig(c => ({ ...c, autoRenewalEnabled: v }))} label="Enable Auto-Renewal" />
            <Toggle checked={config.taxEnabled} onChange={v => setConfig(c => ({ ...c, taxEnabled: v }))} label="Enable Tax Collection" />
            {config.taxEnabled && (
              <div className="grid grid-cols-2 gap-3 pl-11">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Tax Label</label>
                  <Input value={config.taxLabel} onChange={e => setConfig(c => ({ ...c, taxLabel: e.target.value }))} className="bg-black/50 border-white/10 text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Tax Rate (%)</label>
                  <Input type="number" value={config.taxRate} onChange={e => setConfig(c => ({ ...c, taxRate: e.target.value }))} className="bg-black/50 border-white/10 text-white" />
                </div>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Invoice Due (days)</label>
                <Input type="number" value={config.invoiceDueDays} onChange={e => setConfig(c => ({ ...c, invoiceDueDays: Number(e.target.value) }))} className="bg-black/50 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Grace Period (days)</label>
                <Input type="number" value={config.gracePeriodDays} onChange={e => setConfig(c => ({ ...c, gracePeriodDays: Number(e.target.value) }))} className="bg-black/50 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Suspend After (days)</label>
                <Input type="number" value={config.suspendAfterDays} onChange={e => setConfig(c => ({ ...c, suspendAfterDays: Number(e.target.value) }))} className="bg-black/50 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Terminate After (days)</label>
                <Input type="number" value={config.terminateAfterDays} onChange={e => setConfig(c => ({ ...c, terminateAfterDays: Number(e.target.value) }))} className="bg-black/50 border-white/10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
