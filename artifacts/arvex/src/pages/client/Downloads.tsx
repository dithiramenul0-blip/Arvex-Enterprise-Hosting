import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, FileText, Shield, Server, Code, Zap, ExternalLink } from "lucide-react";
import { ClientLayout } from "@/components/ClientLayout";

interface DownloadItem {
  id: number;
  name: string;
  desc: string;
  version: string;
  size: string;
  category: string;
  icon: React.ElementType;
  href: string;
}

const DOWNLOADS: DownloadItem[] = [
  { id: 1, name: "ArveX API Client (Node.js)", desc: "Official Node.js SDK for the ArveX REST API. Includes TypeScript types.", version: "v2.1.0", size: "48 KB", category: "SDK", icon: Code, href: "#" },
  { id: 2, name: "ArveX API Client (Python)", desc: "Official Python library for interacting with the ArveX API.", version: "v1.3.2", size: "32 KB", category: "SDK", icon: Code, href: "#" },
  { id: 3, name: "Minecraft Server Config Pack", desc: "Optimized Paper/Purpur config files for maximum performance.", version: "v1.21.x", size: "12 KB", category: "Game Configs", icon: Server, href: "#" },
  { id: 4, name: "Pterodactyl Egg Collection", desc: "Custom Pterodactyl eggs for popular games and bots.", version: "2025-06", size: "85 KB", category: "Pterodactyl", icon: Server, href: "#" },
  { id: 5, name: "ArveX VPS Setup Script", desc: "Automated server hardening and optimization script for Ubuntu/Debian.", version: "v3.0.1", size: "18 KB", category: "Scripts", icon: Code, href: "#" },
  { id: 6, name: "SSL Certificate Manager", desc: "CLI tool to manage and auto-renew SSL certs for your domains.", version: "v1.0.4", size: "22 KB", category: "Scripts", icon: Shield, href: "#" },
  { id: 7, name: "ArveX Terms of Service", desc: "PDF version of our full Terms of Service agreement.", version: "2025-01", size: "180 KB", category: "Legal", icon: FileText, href: "#" },
  { id: 8, name: "SLA Agreement PDF", desc: "Service Level Agreement detailing our 99.99% uptime commitment.", version: "2025-01", size: "95 KB", category: "Legal", icon: FileText, href: "#" },
];

const CATEGORIES = [...new Set(DOWNLOADS.map(d => d.category))];

export default function ClientDownloads() {
  return (
    <ClientLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Download Center</h1>
          <p className="text-muted-foreground text-sm mt-1">SDKs, tools, configs, and documents for your ArveX services.</p>
        </div>

        {CATEGORIES.map((cat, ci) => (
          <div key={cat}>
            <div className="text-xs font-bold text-primary/70 uppercase tracking-widest mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-primary/10" />{cat}<div className="h-px flex-1 bg-primary/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DOWNLOADS.filter(d => d.category === cat).map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (ci * 0.1) + (i * 0.07) }}
                    className="glass-panel p-6 rounded-2xl flex items-start gap-4 group hover:border-primary/30 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-bold text-sm mb-1">{item.name}</div>
                      <div className="text-muted-foreground text-xs mb-3 leading-relaxed">{item.desc}</div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
                        <span className="bg-white/5 px-2 py-0.5 rounded font-mono">{item.version}</span>
                        <span>{item.size}</span>
                      </div>
                    </div>
                    <a href={item.href} className="shrink-0">
                      <Button size="sm" variant="outline" className="border-white/10 text-muted-foreground hover:text-white hover:border-primary/40 transition-all">
                        <Download className="w-3.5 h-3.5 mr-1.5" /> Download
                      </Button>
                    </a>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Links */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Useful Links</div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "API Documentation", href: "#" },
              { label: "Knowledge Base", href: "#" },
              { label: "Status Page", href: "https://status.arvex.host" },
              { label: "GitHub", href: "#" },
            ].map((l, i) => (
              <a key={i} href={l.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-bold text-primary/70 bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-full transition-colors">
                <ExternalLink className="w-3 h-3" />{l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
