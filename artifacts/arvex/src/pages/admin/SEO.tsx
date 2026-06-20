import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, Save, Globe, Image, Code, CheckCircle2, AlertCircle } from "lucide-react";

interface PageSEO {
  path: string;
  label: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDesc: string;
  ogImage: string;
  canonical: string;
  noIndex: boolean;
}

const PAGES: PageSEO[] = [
  { path: "/", label: "Homepage", title: "ArveX Hosting™ — Enterprise VPS, Minecraft & Bot Hosting", description: "High-performance VPS, Minecraft, Bot, VDS, Web, and V2Ray hosting with 10 Tbps DDoS protection and 99.99% uptime. Deploy in 60 seconds.", keywords: "vps hosting, minecraft hosting, bot hosting, cheap vps, ddos protected hosting", ogTitle: "ArveX Hosting™ — Enterprise Hosting Solutions", ogDesc: "Deploy enterprise-grade servers in 60 seconds. NVMe SSD, 10 Tbps DDoS, 12+ locations.", ogImage: "https://arvex.host/og-home.jpg", canonical: "https://arvex.host/", noIndex: false },
  { path: "/vps", label: "VPS Hosting", title: "VPS Hosting — Root Access NVMe Servers | ArveX", description: "Full root access VPS with NVMe SSD, DDoS protection, and instant deployment. Starting from $4.99/month.", keywords: "vps hosting, nvme vps, root access vps, cheap vps server", ogTitle: "VPS Hosting Plans — ArveX", ogDesc: "Root access VPS on NVMe hardware from $4.99/mo. 10 Gbps uplink, 10 Tbps DDoS.", ogImage: "https://arvex.host/og-vps.jpg", canonical: "https://arvex.host/vps", noIndex: false },
  { path: "/minecraft", label: "Minecraft Hosting", title: "Minecraft Server Hosting — Ultra-Low Latency | ArveX", description: "High-performance Minecraft hosting with Pterodactyl panel, mod support, and 10 Tbps DDoS protection.", keywords: "minecraft server hosting, cheap minecraft hosting, ddos protected minecraft", ogTitle: "Minecraft Hosting — ArveX", ogDesc: "Ultra-low latency Minecraft hosting from $2.99/mo. Paper, Forge, Fabric, Bungeecord.", ogImage: "https://arvex.host/og-minecraft.jpg", canonical: "https://arvex.host/minecraft", noIndex: false },
  { path: "/bot-hosting", label: "Bot Hosting", title: "Discord Bot Hosting — 24/7 Uptime | ArveX", description: "Discord bot hosting with 24/7 uptime, Node.js, Python, Java support. Starting $1.99/month.", keywords: "discord bot hosting, bot hosting, nodejs hosting, 24/7 bot uptime", ogTitle: "Discord Bot Hosting — ArveX", ogDesc: "24/7 uptime bot hosting from $1.99/mo. Node.js, Python, Java, Go.", ogImage: "https://arvex.host/og-bot.jpg", canonical: "https://arvex.host/bot-hosting", noIndex: false },
  { path: "/login", label: "Login Page", title: "Login — ArveX Hosting", description: "Sign in to your ArveX client dashboard.", keywords: "", ogTitle: "Login — ArveX", ogDesc: "", ogImage: "", canonical: "https://arvex.host/login", noIndex: true },
  { path: "/register", label: "Register", title: "Create Account — ArveX Hosting", description: "Register for a free ArveX account and deploy your server in 60 seconds.", keywords: "", ogTitle: "Register — ArveX", ogDesc: "", ogImage: "", canonical: "https://arvex.host/register", noIndex: false },
];

const GLOBAL = {
  siteName: "ArveX Hosting™",
  robotsTxt: `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /client\nDisallow: /api\nSitemap: https://arvex.host/sitemap.xml`,
  sitemapEnabled: true,
  structuredData: `{"@context":"https://schema.org","@type":"Organization","name":"ArveX Hosting","url":"https://arvex.host","logo":"https://arvex.host/logo.png","sameAs":["https://discord.gg/arvex"]}`,
};

export default function AdminSEO() {
  const [pages, setPages] = useState<PageSEO[]>(PAGES);
  const [selected, setSelected] = useState<PageSEO>(PAGES[0]);
  const [robotsTxt, setRobotsTxt] = useState(GLOBAL.robotsTxt);
  const [structuredData, setStructuredData] = useState(GLOBAL.structuredData);
  const { toast } = useToast();

  const handleSave = () => {
    setPages(prev => prev.map(p => p.path === selected.path ? selected : p));
    toast({ title: "✅ SEO settings saved!" });
  };

  const titleLen = selected.title.length;
  const descLen = selected.description.length;
  const titleOk = titleLen >= 50 && titleLen <= 60;
  const descOk = descLen >= 140 && descLen <= 160;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">SEO Manager</h1>
          <p className="text-muted-foreground mt-1">Optimize meta tags, Open Graph, robots.txt, and structured data.</p>
        </div>
        <Button onClick={handleSave} className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold">
          <Save className="w-4 h-4 mr-2" /> Save Page
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Page selector */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">Pages</div>
          {pages.map((p, i) => (
            <motion.button key={p.path} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(p)}
              className={`w-full glass-panel p-3 rounded-xl text-left transition-all ${selected.path === p.path ? "border-glow" : "hover:border-primary/30"}`}>
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-sm truncate">{p.label}</span>
                {p.noIndex && <span className="text-[10px] font-bold text-yellow-400 bg-yellow-500/10 px-1.5 py-0.5 rounded">NOINDEX</span>}
              </div>
              <span className="text-muted-foreground text-xs font-mono">{p.path}</span>
            </motion.button>
          ))}
        </div>

        {/* SEO Editor */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-8 rounded-2xl space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <Search className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-black text-white uppercase">Meta Tags — {selected.label}</h3>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Page Title</label>
                <div className={`flex items-center gap-1 text-xs font-bold ${titleOk ? "text-green-400" : "text-yellow-400"}`}>
                  {titleOk ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {titleLen}/60
                </div>
              </div>
              <Input value={selected.title} onChange={e => setSelected(s => ({ ...s, title: e.target.value }))} className="bg-black/50 border-white/10 text-white" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Meta Description</label>
                <div className={`flex items-center gap-1 text-xs font-bold ${descOk ? "text-green-400" : "text-yellow-400"}`}>
                  {descOk ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {descLen}/160
                </div>
              </div>
              <Textarea value={selected.description} onChange={e => setSelected(s => ({ ...s, description: e.target.value }))} className="bg-black/50 border-white/10 text-white min-h-[80px]" />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Keywords (comma-separated)</label>
              <Input value={selected.keywords} onChange={e => setSelected(s => ({ ...s, keywords: e.target.value }))} className="bg-black/50 border-white/10 text-white" />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Canonical URL</label>
              <Input value={selected.canonical} onChange={e => setSelected(s => ({ ...s, canonical: e.target.value }))} className="bg-black/50 border-white/10 text-white font-mono text-sm" />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={selected.noIndex} onChange={e => setSelected(s => ({ ...s, noIndex: e.target.checked }))} className="w-4 h-4 accent-primary" />
              <span className="text-sm font-medium text-muted-foreground">No-index this page (prevents Google from indexing)</span>
            </label>
          </div>

          {/* Open Graph */}
          <div className="glass-panel p-8 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Image className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-black text-white uppercase">Open Graph / Social Preview</h3>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">OG Title</label>
              <Input value={selected.ogTitle} onChange={e => setSelected(s => ({ ...s, ogTitle: e.target.value }))} className="bg-black/50 border-white/10 text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">OG Description</label>
              <Textarea value={selected.ogDesc} onChange={e => setSelected(s => ({ ...s, ogDesc: e.target.value }))} className="bg-black/50 border-white/10 text-white min-h-[60px]" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">OG Image URL</label>
              <Input value={selected.ogImage} onChange={e => setSelected(s => ({ ...s, ogImage: e.target.value }))} placeholder="https://..." className="bg-black/50 border-white/10 text-white" />
            </div>
            {selected.ogImage && (
              <div className="rounded-xl overflow-hidden h-32 bg-black/40 border border-white/10">
                <img src={selected.ogImage} alt="OG preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = "none")} />
              </div>
            )}
          </div>

          {/* Robots & Sitemap */}
          <div className="glass-panel p-8 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-black text-white uppercase">Robots.txt</h3>
            </div>
            <Textarea value={robotsTxt} onChange={e => setRobotsTxt(e.target.value)} className="bg-black/50 border-white/10 text-white font-mono text-sm min-h-[120px]" />
          </div>

          <div className="glass-panel p-8 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Code className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-black text-white uppercase">Structured Data (JSON-LD)</h3>
            </div>
            <Textarea value={structuredData} onChange={e => setStructuredData(e.target.value)} className="bg-black/50 border-white/10 text-white font-mono text-sm min-h-[120px]" />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} size="lg" className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold px-10">
              <Save className="w-4 h-4 mr-2" /> Save SEO Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
