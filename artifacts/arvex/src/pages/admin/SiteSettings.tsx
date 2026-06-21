import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useGetSiteSettings, useUpdateSiteSettings } from "@workspace/api-client-react";
import {
  Globe, Zap, MapPin, Star, MessageSquare, Shield, Server,
  Save, Plus, Trash2, ChevronDown, ChevronUp, RefreshCw, Loader2, CheckCircle2,
  Palette, Link2, Bell, Image, Mail
} from "lucide-react";

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
  brandSiteName: string;
  brandLogoUrl: string;
  brandPrimaryColor: string;
  brandTagline: string;
  brandDiscordUrl: string;
  brandTwitterUrl: string;
  brandYoutubeUrl: string;
  brandSupportEmail: string;
  brandBillingEmail: string;
  brandHeroBgUrl: string;
  brandHeroOverlayOpacity: string;
  brandAnnouncementEnabled: boolean;
  brandAnnouncementText: string;
  brandAnnouncementColor: string;
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
  brandSiteName: "",
  brandLogoUrl: "",
  brandPrimaryColor: "",
  brandTagline: "",
  brandDiscordUrl: "",
  brandTwitterUrl: "",
  brandYoutubeUrl: "",
  brandSupportEmail: "support@arvexhosting.com",
  brandBillingEmail: "billing@arvexhosting.com",
  brandHeroBgUrl: "",
  brandHeroOverlayOpacity: "0.85",
  brandAnnouncementEnabled: false,
  brandAnnouncementText: "",
  brandAnnouncementColor: "primary",
};

function settingsToKv(s: SiteSettings): Record<string, string> {
  return {
    heroTitle: s.heroTitle,
    heroSubtitle: s.heroSubtitle,
    heroBadge: s.heroBadge,
    heroStats: JSON.stringify(s.heroStats),
    services: JSON.stringify(s.services),
    features: JSON.stringify(s.features),
    locations: JSON.stringify(s.locations),
    testimonials: JSON.stringify(s.testimonials),
    faqs: JSON.stringify(s.faqs),
    ctaTitle: s.ctaTitle,
    ctaSubtitle: s.ctaSubtitle,
    footerTagline: s.footerTagline,
    pricingFrom: s.pricingFrom,
    brand_site_name: s.brandSiteName,
    brand_logo_url: s.brandLogoUrl,
    brand_primary_color: s.brandPrimaryColor,
    brand_tagline: s.brandTagline,
    brand_discord_url: s.brandDiscordUrl,
    brand_twitter_url: s.brandTwitterUrl,
    brand_youtube_url: s.brandYoutubeUrl,
    brand_support_email: s.brandSupportEmail,
    brand_billing_email: s.brandBillingEmail,
    brand_hero_bg_url: s.brandHeroBgUrl,
    brand_hero_overlay_opacity: s.brandHeroOverlayOpacity,
    brand_announcement_enabled: String(s.brandAnnouncementEnabled),
    brand_announcement_text: s.brandAnnouncementText,
    brand_announcement_color: s.brandAnnouncementColor,
  };
}

function kvToSettings(kv: Record<string, string>): SiteSettings {
  const tryParse = <T,>(key: string, fallback: T): T => {
    try { return kv[key] ? JSON.parse(kv[key]) : fallback; } catch { return fallback; }
  };
  return {
    heroTitle: kv.heroTitle ?? DEFAULT_SETTINGS.heroTitle,
    heroSubtitle: kv.heroSubtitle ?? DEFAULT_SETTINGS.heroSubtitle,
    heroBadge: kv.heroBadge ?? DEFAULT_SETTINGS.heroBadge,
    heroStats: tryParse("heroStats", DEFAULT_SETTINGS.heroStats),
    services: tryParse("services", DEFAULT_SETTINGS.services),
    features: tryParse("features", DEFAULT_SETTINGS.features),
    locations: tryParse("locations", DEFAULT_SETTINGS.locations),
    testimonials: tryParse("testimonials", DEFAULT_SETTINGS.testimonials),
    faqs: tryParse("faqs", DEFAULT_SETTINGS.faqs),
    ctaTitle: kv.ctaTitle ?? DEFAULT_SETTINGS.ctaTitle,
    ctaSubtitle: kv.ctaSubtitle ?? DEFAULT_SETTINGS.ctaSubtitle,
    footerTagline: kv.footerTagline ?? DEFAULT_SETTINGS.footerTagline,
    pricingFrom: kv.pricingFrom ?? DEFAULT_SETTINGS.pricingFrom,
    brandSiteName: kv.brand_site_name ?? "",
    brandLogoUrl: kv.brand_logo_url ?? "",
    brandPrimaryColor: kv.brand_primary_color ?? "",
    brandTagline: kv.brand_tagline ?? "",
    brandDiscordUrl: kv.brand_discord_url ?? "",
    brandTwitterUrl: kv.brand_twitter_url ?? "",
    brandYoutubeUrl: kv.brand_youtube_url ?? "",
    brandSupportEmail: kv.brand_support_email ?? "support@arvexhosting.com",
    brandBillingEmail: kv.brand_billing_email ?? "billing@arvexhosting.com",
    brandHeroBgUrl: kv.brand_hero_bg_url ?? "",
    brandHeroOverlayOpacity: kv.brand_hero_overlay_opacity ?? "0.85",
    brandAnnouncementEnabled: kv.brand_announcement_enabled === "true",
    brandAnnouncementText: kv.brand_announcement_text ?? "",
    brandAnnouncementColor: kv.brand_announcement_color ?? "primary",
  };
}

function SectionCard({ title, icon: Icon, children, defaultOpen = false }: { title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-panel border-white/10 rounded-xl">
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
    </div>
  );
}

export default function AdminSiteSettings() {
  const { toast } = useToast();
  const { data: savedKv, isLoading, refetch } = useGetSiteSettings();
  const updateMutation = useUpdateSiteSettings({
    mutation: {
      onSuccess: () => {
        toast({ title: "✅ Site settings saved to database!", description: "Changes are live across all devices." });
        refetch();
      },
      onError: () => {
        toast({ title: "❌ Failed to save settings", variant: "destructive" });
      },
    },
  });

  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    if (savedKv && Object.keys(savedKv).length > 0) {
      setSettings(kvToSettings(savedKv as Record<string, string>));
    }
  }, [savedKv]);

  const update = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateMutation.mutate({ data: settingsToKv(settings) });
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    updateMutation.mutate({ data: settingsToKv(DEFAULT_SETTINGS) });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Site Customizer</h1>
          <p className="text-muted-foreground mt-1">Edit all homepage content — saved to database, live everywhere.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset} disabled={updateMutation.isPending} className="border-white/10 text-muted-foreground hover:text-white">
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending} className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold">
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save All Changes
          </Button>
        </div>
      </div>

      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-sm text-green-300 font-medium flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        Settings are saved to the database and apply globally — no browser cache dependency.
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
                  <Input value={stat.label} onChange={e => updateListItem<StatOverride>("heroStats", i, "label", e.target.value)} placeholder="Label" className="bg-transparent border-white/10 text-white text-xs flex-1" />
                  <Input value={stat.value} onChange={e => updateListItem<StatOverride>("heroStats", i, "value", e.target.value)} placeholder="Value" className="bg-transparent border-white/10 text-white text-xs flex-1" />
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
          <Button variant="outline" onClick={() => addListItem<Service>("services", { key: `custom-${Date.now()}`, title: "New Service", href: "/new", desc: "Service description.", badge: "FROM $X.XX/MO" })} className="w-full border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-primary/40">
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
          <Button variant="outline" onClick={() => addListItem<Feature>("features", { title: "New Feature", desc: "Feature description here." })} className="w-full border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-primary/40">
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
                <Input type="number" value={loc.nodes} onChange={e => updateListItem<Location>("locations", i, "nodes", parseInt(e.target.value) || 0)} placeholder="Active nodes" className="bg-black/50 border-white/10 text-white text-sm" />
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={() => addListItem<Location>("locations", { city: "New City", country: "Country", flag: "🏳️", region: "Region", ping: "~10ms", nodes: 10 })} className="w-full border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-primary/40">
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
          <Button variant="outline" onClick={() => addListItem<Testimonial>("testimonials", { name: "Customer Name", role: "Customer Role", text: "Great hosting service!", service: "VPS Hosting" })} className="w-full border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-primary/40">
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
          <Button variant="outline" onClick={() => addListItem<Faq>("faqs", { q: "New question?", a: "Answer here." })} className="w-full border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-primary/40">
            <Plus className="w-4 h-4 mr-2" /> Add FAQ
          </Button>
        </div>
      </SectionCard>

      {/* Branding & Appearance */}
      <SectionCard title="Branding & Appearance" icon={Palette} defaultOpen>
        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Site Name</label>
              <Input value={settings.brandSiteName} onChange={e => update("brandSiteName", e.target.value)} placeholder="ArveX" className="bg-black/50 border-white/10 text-white" />
              <p className="text-xs text-muted-foreground mt-1">Shown in navbar, footer, and browser tab</p>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Footer Tagline</label>
              <Input value={settings.brandTagline} onChange={e => update("brandTagline", e.target.value)} placeholder="Elite infrastructure for..." className="bg-black/50 border-white/10 text-white" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block flex items-center gap-2"><Image className="w-3 h-3" /> Logo URL</label>
            <Input value={settings.brandLogoUrl} onChange={e => update("brandLogoUrl", e.target.value)} placeholder="https://your-cdn.com/logo.png" className="bg-black/50 border-white/10 text-white" />
            {settings.brandLogoUrl && (
              <div className="mt-2 p-3 bg-black/30 rounded-lg border border-white/5 flex items-center gap-3">
                <img src={settings.brandLogoUrl} alt="Logo preview" className="w-10 h-10 object-contain rounded" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <span className="text-xs text-muted-foreground">Logo preview</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block flex items-center gap-2"><Image className="w-3 h-3" /> Hero Background Image URL</label>
            <Input value={settings.brandHeroBgUrl} onChange={e => update("brandHeroBgUrl", e.target.value)} placeholder="https://images.unsplash.com/photo-...?w=1920" className="bg-black/50 border-white/10 text-white" />
            <p className="text-xs text-muted-foreground mt-1">Leave empty to use the default datacenter photo</p>
            {settings.brandHeroBgUrl && (
              <div className="mt-2 rounded-lg overflow-hidden h-24 border border-white/10 relative">
                <img src={settings.brandHeroBgUrl} alt="Hero preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-xs text-white font-bold">Hero Preview</span>
                </div>
              </div>
            )}
            <div className="mt-3">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Hero Overlay Opacity (0.5 = lighter, 0.95 = darker)</label>
              <div className="flex items-center gap-3">
                <input type="range" min="0.3" max="0.98" step="0.05" value={settings.brandHeroOverlayOpacity}
                  onChange={e => update("brandHeroOverlayOpacity", e.target.value)}
                  className="flex-1 accent-primary" />
                <span className="text-sm text-white font-mono w-12 text-right">{settings.brandHeroOverlayOpacity}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block flex items-center gap-2"><Palette className="w-3 h-3" /> Brand Primary Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={settings.brandPrimaryColor || "#7c3aed"}
                onChange={e => update("brandPrimaryColor", e.target.value)}
                className="w-12 h-10 rounded-lg border border-white/10 bg-black/50 cursor-pointer p-1" />
              <Input value={settings.brandPrimaryColor} onChange={e => update("brandPrimaryColor", e.target.value)} placeholder="#7c3aed (leave empty for default purple)" className="bg-black/50 border-white/10 text-white flex-1" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Hex color code. Leave empty to use default purple.</p>
          </div>
        </div>
      </SectionCard>

      {/* Social Links & Contact */}
      <SectionCard title="Social Links & Contact" icon={Link2}>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Discord Server URL</label>
              <Input value={settings.brandDiscordUrl} onChange={e => update("brandDiscordUrl", e.target.value)} placeholder="https://discord.gg/yourinvite" className="bg-black/50 border-white/10 text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Twitter / X URL</label>
              <Input value={settings.brandTwitterUrl} onChange={e => update("brandTwitterUrl", e.target.value)} placeholder="https://x.com/youraccount" className="bg-black/50 border-white/10 text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">YouTube Channel URL</label>
              <Input value={settings.brandYoutubeUrl} onChange={e => update("brandYoutubeUrl", e.target.value)} placeholder="https://youtube.com/@yourchannel" className="bg-black/50 border-white/10 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block flex items-center gap-1"><Mail className="w-3 h-3" /> Support Email</label>
              <Input value={settings.brandSupportEmail} onChange={e => update("brandSupportEmail", e.target.value)} placeholder="support@yourdomain.com" className="bg-black/50 border-white/10 text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block flex items-center gap-1"><Mail className="w-3 h-3" /> Billing Email</label>
              <Input value={settings.brandBillingEmail} onChange={e => update("brandBillingEmail", e.target.value)} placeholder="billing@yourdomain.com" className="bg-black/50 border-white/10 text-white" />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Announcement Bar */}
      <SectionCard title="Announcement Bar" icon={Bell}>
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl border border-white/5">
            <button
              onClick={() => update("brandAnnouncementEnabled", !settings.brandAnnouncementEnabled)}
              className={`relative w-11 h-6 rounded-full transition-colors ${settings.brandAnnouncementEnabled ? "bg-primary" : "bg-white/10"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${settings.brandAnnouncementEnabled ? "left-5.5 translate-x-0.5" : "left-0.5"}`} />
            </button>
            <span className="text-sm font-bold text-white">{settings.brandAnnouncementEnabled ? "Enabled — banner is visible on website" : "Disabled — no banner shown"}</span>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Announcement Text</label>
            <Input value={settings.brandAnnouncementText} onChange={e => update("brandAnnouncementText", e.target.value)} placeholder="🎉 Special offer: 50% off first month! Use code LAUNCH50" className="bg-black/50 border-white/10 text-white" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 block">Banner Color</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "primary", label: "Purple", cls: "bg-primary/20 border-primary/40 text-primary" },
                { value: "yellow", label: "Yellow", cls: "bg-yellow-500/20 border-yellow-500/40 text-yellow-300" },
                { value: "green", label: "Green", cls: "bg-green-500/20 border-green-500/40 text-green-300" },
                { value: "red", label: "Red", cls: "bg-red-500/20 border-red-500/40 text-red-300" },
              ].map(opt => (
                <button key={opt.value} onClick={() => update("brandAnnouncementColor", opt.value)}
                  className={`px-4 py-2 rounded-lg border font-bold text-xs uppercase tracking-wider transition-all ${opt.cls} ${settings.brandAnnouncementColor === opt.value ? "ring-2 ring-white/30 scale-105" : "opacity-60 hover:opacity-100"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
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
        <Button variant="outline" onClick={handleReset} disabled={updateMutation.isPending} className="border-white/10 text-muted-foreground hover:text-white">
          <RefreshCw className="w-4 h-4 mr-2" /> Reset to Defaults
        </Button>
        <Button onClick={handleSave} disabled={updateMutation.isPending} size="lg" className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold px-8">
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
