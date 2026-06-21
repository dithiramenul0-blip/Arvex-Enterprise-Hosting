import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Users, Server, Ticket, Settings, LogOut, ArrowLeft,
  Building, Zap, Cpu, Terminal, Globe, Paintbrush, BarChart3, Tag,
  Megaphone, ShieldCheck, Mail, ChevronDown, ChevronRight, Search,
  MessageSquare, HardDrive, CreditCard, FileText, Webhook, Wrench,
  Network, Database, Key, Activity, Bell, TrendingUp, Radio,
  Layers, Code2, Package, Bot, Shield, RefreshCw, CheckCircle2,
  Map, Wallet, Gift, UserCog, LayoutGrid, LineChart, Gauge
} from "lucide-react";
import { ReactNode, useState } from "react";
import { PageTransition } from "./PageTransition";
import { useBrandSettings } from "@/hooks/useBrandSettings";

interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const NAV_SECTIONS: { section: string; links: NavLink[] }[] = [
  {
    section: "Overview",
    links: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    section: "Website",
    links: [
      { href: "/admin/site-settings", label: "Site Customizer", icon: Paintbrush },
      { href: "/admin/branding", label: "Branding & Design", icon: Layers },
      { href: "/admin/announcements", label: "Announcements", icon: Megaphone, badge: "Live", badgeColor: "green" },
      { href: "/admin/seo", label: "SEO Manager", icon: Search },
      { href: "/admin/content", label: "Content Pages", icon: Globe },
      { href: "/admin/files", label: "File Manager", icon: HardDrive },
    ],
  },
  {
    section: "Users",
    links: [
      { href: "/admin/users", label: "User Manager", icon: Users },
      { href: "/admin/roles", label: "Roles & Permissions", icon: ShieldCheck },
    ],
  },
  {
    section: "Billing",
    links: [
      { href: "/admin/billing", label: "Payment Gateways", icon: CreditCard },
      { href: "/admin/plans", label: "Plan Manager", icon: Package },
      { href: "/admin/plan-mappings", label: "Plan Mappings", icon: Map },
      { href: "/admin/coupons", label: "Coupon Manager", icon: Tag },
    ],
  },
  {
    section: "Services",
    links: [
      { href: "/admin/services", label: "All Services", icon: Server },
      { href: "/admin/provisions", label: "Server Control", icon: Terminal },
      { href: "/admin/pterodactyl", label: "Pterodactyl", icon: Zap },
      { href: "/admin/proxmox", label: "Proxmox", icon: Cpu },
    ],
  },
  {
    section: "Support",
    links: [
      { href: "/admin/tickets", label: "Tickets", icon: Ticket },
      { href: "/admin/email-templates", label: "Email Templates", icon: Mail },
      { href: "/admin/webhooks", label: "Discord Webhooks", icon: MessageSquare },
    ],
  },
  {
    section: "Partners",
    links: [
      { href: "/admin/partners", label: "Partner Logos", icon: Building },
    ],
  },
  {
    section: "System",
    links: [
      { href: "/admin/audit-logs", label: "Audit Logs", icon: FileText },
    ],
  },
];

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/analytics": "Analytics",
  "/admin/site-settings": "Site Customizer",
  "/admin/branding": "Branding & Design",
  "/admin/announcements": "Announcements",
  "/admin/seo": "SEO Manager",
  "/admin/content": "Content Pages",
  "/admin/files": "File Manager",
  "/admin/users": "User Manager",
  "/admin/roles": "Roles & Permissions",
  "/admin/billing": "Payment Gateways",
  "/admin/plans": "Plan Manager",
  "/admin/plan-mappings": "Plan Mappings",
  "/admin/coupons": "Coupon Manager",
  "/admin/services": "All Services",
  "/admin/provisions": "Server Control",
  "/admin/pterodactyl": "Pterodactyl",
  "/admin/proxmox": "Proxmox",
  "/admin/tickets": "Support Tickets",
  "/admin/email-templates": "Email Templates",
  "/admin/webhooks": "Discord Webhooks",
  "/admin/partners": "Partner Logos",
  "/admin/audit-logs": "Audit Logs",
};

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const brand = useBrandSettings();

  if (!user || user.role !== "admin") return null;

  const toggleSection = (s: string) =>
    setCollapsed(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; });

  const pageTitle = PAGE_TITLES[location] ?? "Admin Panel";

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* ── Sidebar ── */}
      <aside className="w-full md:w-64 bg-[#07070d] border-r border-white/5 flex flex-col z-20 shadow-[4px_0_30px_rgba(0,0,0,0.8)] shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <Link href="/" className="flex items-center gap-3 relative z-10 group">
            {brand.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.siteName} className="w-9 h-9 object-contain rounded-lg" />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:border-primary transition-all duration-300 shadow-[0_0_15px_rgba(124,58,237,0.2)]">
                <Shield className="h-5 w-5 text-primary" />
              </div>
            )}
            <div>
              <div className="font-black text-lg tracking-tighter text-white glow-text uppercase">{brand.siteName || "ArveX"}</div>
              <div className="text-[9px] font-bold text-primary uppercase tracking-widest">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* System Status */}
        <div className="px-4 py-2.5 border-b border-white/5 bg-green-500/5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">All Systems Operational</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 overflow-y-auto scrollbar-thin">
          {NAV_SECTIONS.map(({ section, links }) => (
            <div key={section}>
              <button
                onClick={() => toggleSection(section)}
                className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-black text-muted-foreground/35 uppercase tracking-widest hover:text-muted-foreground transition-colors mt-1"
              >
                {section}
                {collapsed.has(section) ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {!collapsed.has(section) && links.map((link) => {
                const Icon = link.icon;
                const active = location === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all group ${
                      active
                        ? "bg-primary/15 text-primary border border-primary/20 shadow-[0_0_20px_rgba(124,58,237,0.1)]"
                        : "text-muted-foreground/55 hover:bg-white/4 hover:text-white border border-transparent"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 shrink-0 transition-all ${active ? "text-primary drop-shadow-[0_0_6px_rgba(124,58,237,0.8)]" : "group-hover:text-white"}`} />
                    <span className="truncate flex-1">{link.label}</span>
                    {link.badge && (
                      <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                        link.badgeColor === "green" ? "bg-green-500/20 text-green-400" :
                        link.badgeColor === "yellow" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-primary/20 text-primary"
                      }`}>{link.badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-white/5 space-y-2 bg-black/60">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/3 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-violet-600/40 border border-primary/40 flex items-center justify-center text-white font-black text-xs shrink-0">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white font-bold text-xs truncate">{user.firstName} {user.lastName}</div>
              <div className="text-primary/70 text-[10px] font-bold uppercase tracking-wider">Super Admin</div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full shrink-0" />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <Link href="/client">
              <Button variant="outline" className="w-full justify-center text-muted-foreground border-white/8 hover:bg-primary/10 hover:text-primary text-[10px] font-bold uppercase tracking-wide hover:border-primary/30 h-8">
                <ArrowLeft className="h-3 w-3 mr-1 shrink-0" />
                Client
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-center text-muted-foreground/60 hover:text-red-400 hover:bg-red-500/10 text-[10px] font-bold uppercase tracking-wide h-8" onClick={() => logout()}>
              <LogOut className="h-3 w-3 mr-1 shrink-0" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* ── Main Column ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 h-14 bg-[#07070d]/95 border-b border-white/5 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-bold text-muted-foreground/40 uppercase tracking-widest">Admin</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground/30" />
            <span className="font-black text-white uppercase tracking-widest">{pageTitle}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 bg-white/3 border border-white/8 rounded-lg px-3 h-8 text-xs text-muted-foreground/50">
              <Search className="w-3 h-3" />
              <span>Quick search...</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 h-7 rounded-lg bg-green-500/10 border border-green-500/20">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider hidden md:block">Online</span>
            </div>

            <button className="relative w-8 h-8 rounded-lg bg-white/3 border border-white/8 flex items-center justify-center hover:bg-white/8 transition-colors">
              <Bell className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            <Link href="/" className="w-8 h-8 rounded-lg bg-white/3 border border-white/8 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-colors" title="View Website">
              <Globe className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-[#05050b] relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.04),transparent_60%)] pointer-events-none" />
          <PageTransition className="p-6 md:p-8 relative z-10">
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
