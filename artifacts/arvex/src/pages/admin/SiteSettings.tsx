import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Globe, Zap, MapPin, Star, MessageSquare, Shield, Server,
  Save, Plus, Trash2, ChevronDown, ChevronUp, RefreshCw
} from "lucide-react";

const STORAGE_KEY = "arvex_site_settings";

type Service = { key: string; title: string; href: string; desc: string; badge: string };
type Feature = { title: string; desc: string };
type Location = { city: string; country: string; flag: string; region: string; ping: string; nodes: number };
type Testimonial = { name: string; role: string; text: string; service: string };
type Faq = { q: string; a: string };
type StatOverride = { label: string; value: string };

interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  heroStats: StatOverride[];
  services: Service[];
  features: Feature[];
  locations: Location[];
  testimonials: Testimonial[];
  faqs: Faq[];
  ctaTitle: string;
  ctaSubtitle: string;
  footerTagline: string;
  pricingFrom: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: "Enterprise Hosting Solutions",
  heroSubtitle: "High-performance VPS, Minecraft, Bot, VDS, Web, and V2Ray infrastructure built on ultra-fast NVMe arrays. Join over 50,000 players trusting ArveX.",
  heroBadge: "12 Global Datacenters — Always Online",
  heroStats: [
    { label: "Active Players", value: "50,000+" },
    { label: "Live Nodes", value: "12,000+" },
    { label: "Uptime", value: "99.99%" },
    { label: "Support", value: "24/7/365" },
  ],
  services: [
    { key: "vps", title: "VPS Hosting", href: "/vps", desc: "Root access VPS with NVMe SSD, DDoS protection, and instant deploy.", badge: "FROM $4.99/MO" },
    { key: "minecraft", title: "Minecraft", href: "/minecraft", desc: "Ultra-low latency game servers with mod support and auto-backups.", badge: "FROM $2.99/MO" },
    { key: "bot", title: "Bot Hosting", href: "/bot-hosting", desc: "24/7 uptime for Discord bots, automation, and Node.js projects.", badge: "FROM $1.99/MO" },
    { key: "vds", title: "VDS Hosting", href: "/vds", desc: "Dedicated CPU cores and guaranteed RAM for mission-critical workloads.", badge: "FROM $9.99/MO" },
    { key: "web", title: "Web Hosting", href: "/web-hosting", desc: "cPanel web hosting with unlimited subdomains and 1-click WordPress.", badge: "FROM $2.49/MO" },
    { key: "v2ray", title: "V2Ray Proxy", href: "/v2ray", desc: "Enterprise-grade VMess, VLess and Shadowsocks proxy infrastructure.", badge: "FROM $3.99/MO" },
  ],
  features: [
    { title: "Zero-Lag NVMe Infrastructure", desc: "Pure NVMe SSD arrays deliver sub-millisecond I/O so your server never stutters." },
    { title: "10 Tbps DDoS Shield", desc: "Always-on volumetric and L7 protection keeps your services online 24/7." },
    { title: "Instant Deployment", desc: "Automated provisioning via Pterodactyl and Proxmox — live in under 60 seconds." },
    { title: "99.99% Uptime SLA", desc: "Redundant power, multi-gig uplinks, and real-time monitoring back every plan." },
    { title: "Encrypted Backups", desc: "Daily automatic encrypted snapshots with one-click point-in-time restore." },
    { title: "24/7 Expert Support", desc: "Our sysadmins and gamers are online around the clock — no bots, just humans." },
  ],
  locations: [
    { city: "New York", country: "United States", flag: "🇺🇸", region: "North America", ping: "~2ms", nodes: 48 },
    { city: "Los Angeles", country: "United States", flag: "🇺🇸", region: "North America", ping: "~5ms", nodes: 32 },
    { city: "London", country: "United Kingdom", flag: "🇬🇧", region: "Europe", ping: "~8ms", nodes: 40 },
    { city: "Frankfurt", country: "Germany", flag: "🇩🇪", region: "Europe", ping: "~10ms", nodes: 56 },
    { city: "Singapore", country: "Singapore", flag: "🇸🇬", region: "Asia Pacific", ping: "~15ms", nodes: 36 },
    { city: "Tokyo", country: "Japan", flag: "🇯🇵", region: "Asia Pacific", ping: "~18ms", nodes: 24 },
  ],
  testimonials: [
    { name: "Alex Rivera", role: "Minecraft Server Owner", text: "Switched from a competitor and the difference is night and day. Zero lag spikes, instant support, and the DDoS protection actually works.", service: "Minecraft Hosting" },
    { name: "TechBot Studio", role: "Discord Bot Developer", text: "We host 12 production bots here. 99.9% uptime month after month. The dashboard is clean, deploys take seconds.", service: "Bot Hosting" },
    { name: "Sarah K.", role: "SaaS Founder", text: "Moved our entire SaaS stack to ArveX VPS. Setup was effortless, root access is real, and NVMe performance is insane.", service: "VPS Hosting" },
  ],
  faqs: [
    { q: "How fast is deployment after ordering?", a: "Most servers are provisioned automatically and live within 60 seconds of payment confirmation." },
    { q: "What DDoS protection do you offer?", a: "All plans include our 10 Tbps always-on DDoS mitigation at no extra cost." },
    { q: "Can I upgrade or downgrade my plan?", a: "Yes — plan upgrades and downgrades are available anytime from your client dashboard." },
    { q: "Do you offer a money-back guarantee?", a: "We offer a 3-day money-back guarantee on all new orders." },
  ],
  ctaTitle: "Ready to Dominate?",
  ctaSubtitle: "Deploy your premium infrastructure in seconds and experience the ArveX difference today.",
  footerTagline: "Powering the world's best game servers. Elite infrastructure for communities that demand perfection.",
  pricingFrom: "$1.99",
};

function loadSettings(): SiteSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {}
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: SiteSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event("arvex_settings_updated"));
}

function SectionCard({ title, icon: Icon, children, defaultOpen = false }: { title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="glass-panel border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/3 transition-colors rounded-t-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-white uppercase tracking-wide text-sm">{title}</span>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>
      {open && <CardContent className="px-6 pb-6 pt-0 border-t border-white/5">{children}</CardContent>}
    </Card>
  );
}

export default function AdminSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(loadSettings);
  const { toast } = useToast();

  const update = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveSettings(settings);
    toast({ title: "✅ Site settings saved!", description: "Changes are live on the frontend." });
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
    toast({ title: "Settings reset to defaults." });
  };

  const updateListItem = <T,>(key: keyof SiteSettings, index: number, field: keyof T, value: string | number) => {
    const arr = [...(settings[key] as T[])];
    arr[index] = { ...arr[index], [field]: value };
    update(key, arr as SiteSettings[typeof key]);
  };

  const addListItem = <T,>(key: keyof SiteSettings, defaultItem: T) => {
    update(key, [...(settings[key] as T[]), defaultItem] as SiteSettings[typeof key]);
  };

  const removeListItem = (key: keyof SiteSettings, index: number) => {
    const arr = [...(settings[key] as unknown[])];
    arr.splice(index, 1);
    update(key, arr as SiteSettings[typeof key]);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Site Customizer</h1>
          <p className="text-muted-foreground mt-1">Edit all homepage content — hero, services, features, locations, testimonials, FAQ.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset} className="border-white/10 text-muted-foreground hover:text-white">
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
          <Button onClick={handleSave} className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold">
            <Save className="w-4 h-4 mr-2" /> Save All Changes
          </Button>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-sm text-yellow-300 font-medium">
        ⚡ Changes are saved to the browser's local storage and apply instantly on the live site. For permanent storage across devices, use the Content CMS for text pages.
      </div>

      {/* Hero Section */}
      <SectionCard title="Hero Section" icon={Zap} defaultOpen>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Hero Badge Text</label>
            <Input value={settings.heroBadge} onChange={e => update("heroBadge", e.target.value)} className="bg-black/50 border-white/10 text-white" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Main Title</label>
            <Input value={settings.heroTitle} onChange={e => update("heroTitle", e.target.value)} className="bg-black/50 border-white/10 text-white" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Subtitle / Description</label>
            <Textarea value={settings.heroSubtitle} onChange={e => update("heroSubtitle", e.target.value)} className="bg-black/50 border-white/10 text-white min-h-[80px]" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Pricing "From" Amount</label>
            <Input value={settings.pricingFrom} onChange={e => update("pricingFrom", e.target.value)} className="bg-black/50 border-white/10 text-white w-40" placeholder="$1.99" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 block">Stats Counters</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {settings.heroStats.map((stat, i) => (
                <div key={i} className="flex gap-2 p-3 rounded-xl bg-black/30 border border-white/5">
                  <Input
                    value={stat.label}
                    onChange={e => updateListItem<StatOverride>("heroStats", i, "label", e.target.value)}
                    placeholder="Label"
                    className="bg-transparent border-white/10 text-white text-xs flex-1"
                  />
                  <Input
                    value={stat.value}
                    onChange={e => updateListItem<StatOverride>("heroStats", i, "value", e.target.value)}
                    placeholder="Value"
                    className="bg-transparent border-white/10 text-white text-xs flex-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Services */}
      <SectionCard title="Services Grid" icon={Server}>
        <div className="space-y-3 mt-4">
          {settings.services.map((svc, i) => (
            <div key={i} className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">{svc.title}</span>
                <button onClick={() => removeListItem("services", i)} className="text-red-400/60 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input value={svc.title} onChange={e => updateListItem<Service>("services", i, "title", e.target.value)} placeholder="Title" className="bg-black/50 border-white/10 text-white text-sm" />
                <Input value={svc.badge} onChange={e => updateListItem<Service>("services", i, "badge", e.target.value)} placeholder="Badge (e.g. FROM $4.99/MO)" className="bg-black/50 border-white/10 text-white text-sm" />
              </div>
              <Textarea value={svc.desc} onChange={e => updateListItem<Service>("services", i, "desc", e.target.value)} placeholder="Description" className="bg-black/50 border-white/10 text-white text-sm min-h-[60px]" />
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => addListItem<Service>("services", { key: `custom-${Date.now()}`, title: "New Service", href: "/new", desc: "Service description.", badge: "FROM $X.XX/MO" })}
            className="w-full border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-primary/40"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Service
          </Button>
        </div>
      </SectionCard>

      {/* Features */}
      <SectionCard title="Features Section" icon={Zap}>
        <div className="space-y-3 mt-4">
          {settings.features.map((feat, i) => (
            <div key={i} className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
              <div className="flex gap-2">
                <Input value={feat.title} onChange={e => updateListItem<Feature>("features", i, "title", e.target.value)} placeholder="Feature title" className="bg-black/50 border-white/10 text-white text-sm flex-1" />
                <button onClick={() => removeListItem("features", i)} className="text-red-400/60 hover:text-red-400 transition-colors px-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <Textarea value={feat.desc} onChange={e => updateListItem<Feature>("features", i, "desc", e.target.value)} placeholder="Feature description" className="bg-black/50 border-white/10 text-white text-sm min-h-[56px]" />
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => addListItem<Feature>("features", { title: "New Feature", desc: "Feature description here." })}
            className="w-full border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-primary/40"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Feature
          </Button>
        </div>
      </SectionCard>

      {/* Locations */}
      <SectionCard title="Server Locations" icon={MapPin}>
        <div className="space-y-3 mt-4">
          {settings.locations.map((loc, i) => (
            <div key={i} className="p-4 rounded-xl bg-black/30 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-muted-foreground">{loc.flag} {loc.city}, {loc.country}</span>
                <button onClick={() => removeListItem("locations", i)} className="text-red-400/60 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <Input value={loc.flag} onChange={e => updateListItem<Location>("locations", i, "flag", e.target.value)} placeholder="Flag emoji 🇺🇸" className="bg-black/50 border-white/10 text-white text-sm" />
                <Input value={loc.city} onChange={e => updateListItem<Location>("locations", i, "city", e.target.value)} placeholder="City" className="bg-black/50 border-white/10 text-white text-sm" />
                <Input value={loc.country} onChange={e => updateListItem<Location>("locations", i, "country", e.target.value)} placeholder="Country" className="bg-black/50 border-white/10 text-white text-sm" />
                <Input value={loc.region} onChange={e => updateListItem<Location>("locations", i, "region", e.target.value)} placeholder="Region" className="bg-black/50 border-white/10 text-white text-sm" />
                <Input value={loc.ping} onChange={e => updateListItem<Location>("locations", i, "ping", e.target.value)} placeholder="Ping e.g. ~5ms" className="bg-black/50 border-white/10 text-white text-sm" />
                <Input
                  type="number"
                  value={loc.nodes}
                  onChange={e => updateListItem<Location>("locations", i, "nodes", parseInt(e.target.value) || 0)}
                  placeholder="Active nodes"
                  className="bg-black/50 border-white/10 text-white text-sm"
                />
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => addListItem<Location>("locations", { city: "New City", country: "Country", flag: "🏳️", region: "Region", ping: "~10ms", nodes: 10 })}
            className="w-full border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-primary/40"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Location
          </Button>
        </div>
      </SectionCard>

      {/* Testimonials */}
      <SectionCard title="Testimonials" icon={Star}>
        <div className="space-y-3 mt-4">
          {settings.testimonials.map((t, i) => (
            <div key={i} className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">{t.name}</span>
                <button onClick={() => removeListItem("testimonials", i)} className="text-red-400/60 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input value={t.name} onChange={e => updateListItem<Testimonial>("testimonials", i, "name", e.target.value)} placeholder="Name" className="bg-black/50 border-white/10 text-white text-sm" />
                <Input value={t.role} onChange={e => updateListItem<Testimonial>("testimonials", i, "role", e.target.value)} placeholder="Role" className="bg-black/50 border-white/10 text-white text-sm" />
                <Input value={t.service} onChange={e => updateListItem<Testimonial>("testimonials", i, "service", e.target.value)} placeholder="Service type" className="bg-black/50 border-white/10 text-white text-sm" />
              </div>
              <Textarea value={t.text} onChange={e => updateListItem<Testimonial>("testimonials", i, "text", e.target.value)} placeholder="Review text" className="bg-black/50 border-white/10 text-white text-sm min-h-[70px]" />
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => addListItem<Testimonial>("testimonials", { name: "Customer Name", role: "Customer Role", text: "Great hosting service!", service: "VPS Hosting" })}
            className="w-full border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-primary/40"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Testimonial
          </Button>
        </div>
      </SectionCard>

      {/* FAQ */}
      <SectionCard title="FAQ Section" icon={MessageSquare}>
        <div className="space-y-3 mt-4">
          {settings.faqs.map((faq, i) => (
            <div key={i} className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
              <div className="flex items-start gap-2">
                <Input value={faq.q} onChange={e => updateListItem<Faq>("faqs", i, "q", e.target.value)} placeholder="Question" className="bg-black/50 border-white/10 text-white text-sm flex-1" />
                <button onClick={() => removeListItem("faqs", i)} className="text-red-400/60 hover:text-red-400 transition-colors mt-2 px-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <Textarea value={faq.a} onChange={e => updateListItem<Faq>("faqs", i, "a", e.target.value)} placeholder="Answer" className="bg-black/50 border-white/10 text-white text-sm min-h-[70px]" />
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => addListItem<Faq>("faqs", { q: "New question?", a: "Answer here." })}
            className="w-full border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-primary/40"
          >
            <Plus className="w-4 h-4 mr-2" /> Add FAQ
          </Button>
        </div>
      </SectionCard>

      {/* CTA & Footer */}
      <SectionCard title="CTA & Footer" icon={Globe}>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">CTA Title</label>
            <Input value={settings.ctaTitle} onChange={e => update("ctaTitle", e.target.value)} className="bg-black/50 border-white/10 text-white" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">CTA Subtitle</label>
            <Textarea value={settings.ctaSubtitle} onChange={e => update("ctaSubtitle", e.target.value)} className="bg-black/50 border-white/10 text-white min-h-[70px]" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Footer Tagline</label>
            <Textarea value={settings.footerTagline} onChange={e => update("footerTagline", e.target.value)} className="bg-black/50 border-white/10 text-white min-h-[70px]" />
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={handleReset} className="border-white/10 text-muted-foreground hover:text-white">
          <RefreshCw className="w-4 h-4 mr-2" /> Reset to Defaults
        </Button>
        <Button onClick={handleSave} size="lg" className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold px-8">
          <Save className="w-4 h-4 mr-2" /> Save All Changes
        </Button>
      </div>
    </div>
  );
}
