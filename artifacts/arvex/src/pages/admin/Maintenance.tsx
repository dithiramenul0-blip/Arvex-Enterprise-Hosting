import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Wrench, Globe, Palette, Image, Type, Link2, Save, AlertCircle,
  Shield, Mail, ToggleLeft, ToggleRight, Eye, Upload, RefreshCw
} from "lucide-react";

const STORAGE_KEY = "arvex_branding";

interface BrandingSettings {
  siteName: string;
  tagline: string;
  primaryColor: string;
  logoUrl: string;
  faviconUrl: string;
  supportEmail: string;
  discordUrl: string;
  twitterUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  customCss: string;
  customJs: string;
  customHead: string;
  googleAnalytics: string;
  maintenanceMode: boolean;
  maintenanceTitle: string;
  maintenanceMessage: string;
  maintenanceEta: string;
  whiteLabel: boolean;
  whiteLabelName: string;
}

function load(): BrandingSettings {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return { ...defaults(), ...JSON.parse(s) };
  } catch {}
  return defaults();
}

function defaults(): BrandingSettings {
  return {
    siteName: "ArveX Hosting™",
    tagline: "Enterprise Hosting Solutions",
    primaryColor: "#7c3aed",
    logoUrl: "",
    faviconUrl: "",
    supportEmail: "support@arvex.host",
    discordUrl: "https://discord.gg/arvex",
    twitterUrl: "",
    facebookUrl: "",
    youtubeUrl: "",
    customCss: "",
    customJs: "",
    customHead: "",
    googleAnalytics: "",
    maintenanceMode: false,
    maintenanceTitle: "We'll Be Back Soon!",
    maintenanceMessage: "ArveX is undergoing scheduled maintenance. We'll be back shortly.",
    maintenanceEta: "",
    whiteLabel: false,
    whiteLabelName: "",
  };
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-black text-white uppercase tracking-tight">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function Toggle({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5">
      <div>
        <div className="text-white font-medium text-sm">{label}</div>
        {desc && <div className="text-muted-foreground text-xs mt-0.5">{desc}</div>}
      </div>
      <button onClick={() => onChange(!checked)} className="transition-colors">
        {checked
          ? <ToggleRight className="w-8 h-8 text-primary" />
          : <ToggleLeft className="w-8 h-8 text-muted-foreground/40" />}
      </button>
    </div>
  );
}

export default function AdminMaintenance() {
  const [settings, setSettings] = useState<BrandingSettings>(load);
  const { toast } = useToast();

  const u = <K extends keyof BrandingSettings>(key: K, value: BrandingSettings[K]) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    toast({ title: "✅ Branding & maintenance settings saved!" });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Branding & Maintenance</h1>
          <p className="text-muted-foreground mt-1">Site identity, white-label, maintenance mode, and custom code injection.</p>
        </div>
        <Button onClick={handleSave} className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold">
          <Save className="w-4 h-4 mr-2" /> Save All
        </Button>
      </div>

      {/* Maintenance Mode Alert */}
      {settings.maintenanceMode && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <div className="text-red-400 font-bold text-sm">Maintenance Mode is ACTIVE</div>
            <div className="text-red-400/70 text-xs">The site is showing a maintenance page to all visitors. Admins can still access the site.</div>
          </div>
          <Button onClick={() => u("maintenanceMode", false)} variant="outline" className="ml-auto border-red-500/30 text-red-400 hover:bg-red-500/10 shrink-0">
            Disable Now
          </Button>
        </div>
      )}

      {/* Branding */}
      <Section title="Site Branding" icon={Palette}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Site Name</label>
            <Input value={settings.siteName} onChange={e => u("siteName", e.target.value)} className="bg-black/50 border-white/10 text-white" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Tagline</label>
            <Input value={settings.tagline} onChange={e => u("tagline", e.target.value)} className="bg-black/50 border-white/10 text-white" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Primary Color</label>
            <div className="flex gap-3 items-center">
              <input type="color" value={settings.primaryColor} onChange={e => u("primaryColor", e.target.value)} className="w-12 h-12 rounded-xl border border-white/10 bg-transparent cursor-pointer" />
              <Input value={settings.primaryColor} onChange={e => u("primaryColor", e.target.value)} className="bg-black/50 border-white/10 text-white font-mono" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Support Email</label>
            <Input value={settings.supportEmail} onChange={e => u("supportEmail", e.target.value)} className="bg-black/50 border-white/10 text-white" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Logo URL</label>
            <Input value={settings.logoUrl} onChange={e => u("logoUrl", e.target.value)} placeholder="https://..." className="bg-black/50 border-white/10 text-white" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Favicon URL</label>
            <Input value={settings.faviconUrl} onChange={e => u("faviconUrl", e.target.value)} placeholder="https://..." className="bg-black/50 border-white/10 text-white" />
          </div>
        </div>
      </Section>

      {/* Social Links */}
      <Section title="Social Links" icon={Link2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {([
            ["discordUrl", "Discord URL"],
            ["twitterUrl", "Twitter / X URL"],
            ["facebookUrl", "Facebook URL"],
            ["youtubeUrl", "YouTube URL"],
          ] as [keyof BrandingSettings, string][]).map(([key, label]) => (
            <div key={key as string}>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">{label}</label>
              <Input value={settings[key] as string} onChange={e => u(key, e.target.value)} placeholder="https://..." className="bg-black/50 border-white/10 text-white" />
            </div>
          ))}
        </div>
      </Section>

      {/* White Label */}
      <Section title="White Label" icon={Globe}>
        <div className="space-y-4">
          <Toggle checked={settings.whiteLabel} onChange={v => u("whiteLabel", v)} label="Enable White Label Mode" desc="Remove ArveX branding and replace with custom name" />
          {settings.whiteLabel && (
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">White Label Company Name</label>
              <Input value={settings.whiteLabelName} onChange={e => u("whiteLabelName", e.target.value)} placeholder="Your Brand Name" className="bg-black/50 border-white/10 text-white" />
            </div>
          )}
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Google Analytics ID</label>
            <Input value={settings.googleAnalytics} onChange={e => u("googleAnalytics", e.target.value)} placeholder="G-XXXXXXXXXX" className="bg-black/50 border-white/10 text-white font-mono" />
          </div>
        </div>
      </Section>

      {/* Maintenance Mode */}
      <Section title="Maintenance Mode" icon={Wrench}>
        <div className="space-y-4">
          <Toggle checked={settings.maintenanceMode} onChange={v => u("maintenanceMode", v)} label="Enable Maintenance Mode" desc="Shows maintenance page to all visitors. Admins bypass it." />
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Maintenance Title</label>
            <Input value={settings.maintenanceTitle} onChange={e => u("maintenanceTitle", e.target.value)} className="bg-black/50 border-white/10 text-white" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Maintenance Message</label>
            <Textarea value={settings.maintenanceMessage} onChange={e => u("maintenanceMessage", e.target.value)} className="bg-black/50 border-white/10 text-white min-h-[80px]" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Estimated ETA (optional)</label>
            <Input type="datetime-local" value={settings.maintenanceEta} onChange={e => u("maintenanceEta", e.target.value)} className="bg-black/50 border-white/10 text-white" />
          </div>
        </div>
      </Section>

      {/* Code Injection */}
      <Section title="Custom Code Injection" icon={Type}>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-xs text-yellow-300 font-medium mb-4">
          ⚠️ Only add code you trust. Malicious code here can compromise your site.
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Custom &lt;head&gt; HTML</label>
            <Textarea value={settings.customHead} onChange={e => u("customHead", e.target.value)} placeholder="<!-- Meta tags, analytics, fonts -->" className="bg-black/50 border-white/10 text-white font-mono text-sm min-h-[80px]" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Custom CSS</label>
            <Textarea value={settings.customCss} onChange={e => u("customCss", e.target.value)} placeholder="/* Your custom styles */" className="bg-black/50 border-white/10 text-white font-mono text-sm min-h-[80px]" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Custom JavaScript</label>
            <Textarea value={settings.customJs} onChange={e => u("customJs", e.target.value)} placeholder="// Your custom scripts" className="bg-black/50 border-white/10 text-white font-mono text-sm min-h-[80px]" />
          </div>
        </div>
      </Section>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold px-10">
          <Save className="w-4 h-4 mr-2" /> Save All Settings
        </Button>
      </div>
    </div>
  );
}
