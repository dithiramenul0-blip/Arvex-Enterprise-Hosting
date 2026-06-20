import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useGetBillingSettings, useUpdateBillingSettings } from "@workspace/api-client-react";
import { DollarSign, CreditCard, Save, ToggleLeft, ToggleRight, Loader2, CheckCircle2 } from "lucide-react";

interface GatewayConfig {
  id: string;
  name: string;
  logo: string;
  fee: string;
  currencies: string[];
  enabledKey: string;
  modeKey: string;
  apiKeyLabel: string;
  secretLabel: string;
  apiKeyDbKey: string;
  secretDbKey: string;
}

const GATEWAYS: GatewayConfig[] = [
  {
    id: "stripe",
    name: "Stripe",
    logo: "💳",
    fee: "2.9% + $0.30",
    currencies: ["USD", "EUR", "GBP"],
    enabledKey: "stripe_enabled",
    modeKey: "stripe_mode",
    apiKeyLabel: "Publishable Key (pk_...)",
    secretLabel: "Secret Key (sk_...)",
    apiKeyDbKey: "stripe_publishable_key",
    secretDbKey: "stripe_secret_key",
  },
  {
    id: "paypal",
    name: "PayPal",
    logo: "🅿️",
    fee: "3.49% + fixed fee",
    currencies: ["USD", "EUR", "GBP", "CAD"],
    enabledKey: "paypal_enabled",
    modeKey: "paypal_mode",
    apiKeyLabel: "Client ID",
    secretLabel: "Client Secret",
    apiKeyDbKey: "paypal_client_id",
    secretDbKey: "paypal_client_secret",
  },
];

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex items-center gap-3 transition-colors">
      {checked ? <ToggleRight className="w-8 h-8 text-primary" /> : <ToggleLeft className="w-8 h-8 text-muted-foreground/40" />}
      <span className={`text-sm font-medium ${checked ? "text-white" : "text-muted-foreground"}`}>{label}</span>
    </button>
  );
}

export default function AdminBillingSettings() {
  const { toast } = useToast();
  const { data: savedSettings, isLoading, refetch } = useGetBillingSettings();
  const updateMutation = useUpdateBillingSettings({
    mutation: {
      onSuccess: () => {
        toast({ title: "✅ Billing settings saved to database!" });
        refetch();
      },
      onError: () => {
        toast({ title: "❌ Failed to save settings", variant: "destructive" });
      },
    },
  });

  const [localSettings, setLocalSettings] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<GatewayConfig | null>(null);

  useEffect(() => {
    if (savedSettings) {
      setLocalSettings(savedSettings as Record<string, string>);
    }
  }, [savedSettings]);

  const get = (key: string, fallback = "") => localSettings[key] ?? fallback;
  const set = (key: string, value: string) => setLocalSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    updateMutation.mutate({ data: localSettings });
  };

  const handleSaveGateway = () => {
    updateMutation.mutate({ data: localSettings });
    setSelected(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Billing Manager</h1>
          <p className="text-muted-foreground mt-1">Configure payment gateways and invoicing. All settings saved to database.</p>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending} className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold">
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save All Settings
        </Button>
      </div>

      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-sm text-green-300 font-medium flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        Settings are saved to the database and apply globally across all devices.
      </div>

      {/* Payment Gateways */}
      <div className="glass-panel p-8 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-black text-white uppercase">Payment Gateways</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GATEWAYS.map((gw, i) => {
            const enabled = get(gw.enabledKey) === "true";
            const mode = get(gw.modeKey, "sandbox");
            return (
              <motion.div
                key={gw.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`glass-panel p-5 rounded-2xl cursor-pointer transition-all hover:border-primary/30 ${selected?.id === gw.id ? "border-glow" : ""} ${enabled ? "" : "opacity-60"}`}
                onClick={() => setSelected(gw)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{gw.logo}</div>
                    <div>
                      <div className="text-white font-bold">{gw.name}</div>
                      <div className="text-muted-foreground text-xs">{gw.fee}</div>
                    </div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); set(gw.enabledKey, enabled ? "false" : "true"); }}
                    className="transition-colors"
                  >
                    {enabled ? <ToggleRight className="w-7 h-7 text-primary" /> : <ToggleLeft className="w-7 h-7 text-muted-foreground/40" />}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {gw.currencies.map(c => (
                    <span key={c} className="text-[10px] font-bold text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className={`text-[10px] font-bold px-2 py-1 rounded-full ${enabled ? "text-green-400 bg-green-500/10" : "text-muted-foreground bg-white/5"}`}>
                    {enabled ? "● Active" : "○ Disabled"}
                  </div>
                  <div className="flex rounded-lg overflow-hidden border border-white/10">
                    {(["sandbox", "live"] as const).map(m => (
                      <button
                        key={m}
                        onClick={e => { e.stopPropagation(); set(gw.modeKey, m); }}
                        className={`px-2 py-1 text-[10px] font-bold uppercase transition-colors ${mode === m ? "bg-primary text-white" : "text-muted-foreground"}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {get(gw.apiKeyDbKey) && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-xs text-green-400 font-medium">API Keys Configured</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {selected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4"
          >
            <h4 className="text-sm font-black text-white uppercase">Configure: {selected.name}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  {selected.apiKeyLabel}
                </label>
                <Input
                  value={get(selected.apiKeyDbKey)}
                  onChange={e => set(selected.apiKeyDbKey, e.target.value)}
                  placeholder={`Enter ${selected.apiKeyLabel}...`}
                  type="password"
                  className="bg-black/50 border-white/10 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  {selected.secretLabel}
                </label>
                <Input
                  value={get(selected.secretDbKey)}
                  onChange={e => set(selected.secretDbKey, e.target.value)}
                  placeholder={`Enter ${selected.secretLabel}...`}
                  type="password"
                  className="bg-black/50 border-white/10 text-white font-mono text-sm"
                />
              </div>
              {selected.id === "stripe" && (
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    Webhook Secret (optional, for production)
                  </label>
                  <Input
                    value={get("stripe_webhook_secret")}
                    onChange={e => set("stripe_webhook_secret", e.target.value)}
                    placeholder="whsec_..."
                    type="password"
                    className="bg-black/50 border-white/10 text-white font-mono text-sm"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSaveGateway} disabled={updateMutation.isPending} className="bg-primary hover:bg-primary/90 text-white font-bold">
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save {selected.name} Config
              </Button>
              <Button variant="outline" onClick={() => setSelected(null)} className="border-white/10 text-muted-foreground hover:text-white">
                Cancel
              </Button>
            </div>
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
            <Toggle
              checked={get("auto_renewal_enabled", "true") === "true"}
              onChange={v => set("auto_renewal_enabled", v ? "true" : "false")}
              label="Enable Auto-Renewal"
            />
            <Toggle
              checked={get("tax_enabled", "false") === "true"}
              onChange={v => set("tax_enabled", v ? "true" : "false")}
              label="Enable Tax Collection"
            />
            {get("tax_enabled") === "true" && (
              <div className="grid grid-cols-2 gap-3 pl-11">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Tax Label</label>
                  <Input value={get("tax_label", "VAT")} onChange={e => set("tax_label", e.target.value)} className="bg-black/50 border-white/10 text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Tax Rate (%)</label>
                  <Input type="number" value={get("tax_rate", "0")} onChange={e => set("tax_rate", e.target.value)} className="bg-black/50 border-white/10 text-white" />
                </div>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Invoice Due (days)</label>
                <Input type="number" value={get("invoice_due_days", "7")} onChange={e => set("invoice_due_days", e.target.value)} className="bg-black/50 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Grace Period (days)</label>
                <Input type="number" value={get("grace_period_days", "3")} onChange={e => set("grace_period_days", e.target.value)} className="bg-black/50 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Suspend After (days)</label>
                <Input type="number" value={get("suspend_after_days", "14")} onChange={e => set("suspend_after_days", e.target.value)} className="bg-black/50 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Terminate After (days)</label>
                <Input type="number" value={get("terminate_after_days", "30")} onChange={e => set("terminate_after_days", e.target.value)} className="bg-black/50 border-white/10 text-white" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6 pt-6 border-t border-white/5">
          <Button onClick={handleSave} disabled={updateMutation.isPending} className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold px-8">
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
