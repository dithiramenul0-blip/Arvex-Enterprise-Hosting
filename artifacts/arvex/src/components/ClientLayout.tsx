import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Server, ShoppingCart, Ticket, User as UserIcon,
  LogOut, Shield, Bell, History, Code, Download, ChevronDown, ChevronRight,
  CreditCard, Receipt, Gift, Zap, Globe, HelpCircle, BookOpen,
  Settings, Star, Headset, Activity, ArrowUpRight, Wallet
} from "lucide-react";
import { ReactNode, useState } from "react";
import { PageTransition } from "./PageTransition";
import { useBrandSettings } from "@/hooks/useBrandSettings";

interface NavLink { href: string; label: string; icon: React.ElementType; badge?: string }

const NAV_SECTIONS: { section: string; links: NavLink[] }[] = [
  {
    section: "Overview",
    links: [
      { href: "/client", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    section: "Services",
    links: [
      { href: "/client/services", label: "My Services", icon: Server },
      { href: "/client/orders", label: "Orders", icon: ShoppingCart },
    ],
  },
  {
    section: "Billing",
    links: [
      { href: "/client/profile", label: "Payment Methods", icon: CreditCard },
    ],
  },
  {
    section: "Support",
    links: [
      { href: "/client/tickets", label: "Support Tickets", icon: Ticket },
    ],
  },
  {
    section: "Account",
    links: [
      { href: "/client/profile", label: "Profile Settings", icon: UserIcon },
      { href: "/client/notifications", label: "Notifications", icon: Bell },
      { href: "/client/activity", label: "Activity History", icon: History },
    ],
  },
  {
    section: "Developer",
    links: [
      { href: "/client/api", label: "API Access", icon: Code },
      { href: "/client/downloads", label: "Downloads", icon: Download },
    ],
  },
];

const PAGE_TITLES: Record<string, string> = {
  "/client": "Dashboard",
  "/client/services": "My Services",
  "/client/orders": "Orders",
  "/client/tickets": "Support Tickets",
  "/client/profile": "Profile Settings",
  "/client/notifications": "Notifications",
  "/client/activity": "Activity History",
  "/client/api": "API Access",
  "/client/downloads": "Downloads",
};

export function ClientLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const brand = useBrandSettings();

  if (!user) return null;

  const toggleSection = (s: string) =>
    setCollapsed(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; });

  const pageTitle = PAGE_TITLES[location] ?? "Client Area";

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* ── Sidebar ── */}
      <aside className="w-full md:w-60 bg-[#07070d] border-r border-white/5 flex flex-col z-20 shadow-[4px_0_20px_rgba(0,0,0,0.6)] shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <Link href="/" className="flex items-center gap-3 group relative z-10">
            {brand.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.siteName} className="w-9 h-9 object-contain rounded-lg" />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:border-primary transition-all">
                <Server className="h-5 w-5 text-primary" />
              </div>
            )}
            <div>
              <div className="font-black text-lg tracking-tighter text-white uppercase">{brand.siteName || "ArveX"}</div>
              <div className="text-[9px] font-bold text-primary uppercase tracking-widest">Client Area</div>
            </div>
          </Link>
        </div>

        {/* Network Status */}
        <div className="px-4 py-2 border-b border-white/5 bg-green-500/5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Network Online</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 overflow-y-auto space-y-0 scrollbar-thin">
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
                        ? "bg-primary/15 text-primary border border-primary/20 shadow-[0_0_15px_rgba(124,58,237,0.08)]"
                        : "text-muted-foreground/55 hover:bg-white/4 hover:text-white border border-transparent"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 shrink-0 ${active ? "text-primary" : "group-hover:text-white"} transition-colors`} />
                    <span className="truncate flex-1">{link.label}</span>
                    {link.badge && (
                      <span className="text-[9px] font-black bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">{link.badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Upgrade Banner */}
          <div className="mx-2 mt-3 mb-1">
            <Link href="/vps">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-violet-600/10 border border-primary/20 hover:border-primary/40 transition-all cursor-pointer group">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-black text-white uppercase tracking-wide">Upgrade Plan</span>
                </div>
                <p className="text-[10px] text-muted-foreground/70 leading-relaxed">Get more power, storage, and bandwidth</p>
                <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-primary">
                  View Plans <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          </div>

          {/* Admin link */}
          {user.role === "admin" && (
            <div className="mt-1">
              <div className="px-4 py-2 text-[10px] font-black text-muted-foreground/35 uppercase tracking-widest">Admin</div>
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl text-xs font-bold uppercase tracking-wide text-muted-foreground/55 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all"
              >
                <Shield className="h-3.5 w-3.5 shrink-0" />
                Admin Panel
              </Link>
            </div>
          )}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-white/5 space-y-2 bg-black/60">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/3 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-violet-600/40 border border-primary/40 flex items-center justify-center text-white font-black text-xs shrink-0">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-white text-xs truncate">{user.firstName} {user.lastName}</div>
              <div className="text-muted-foreground text-[10px] truncate">{user.email}</div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full shrink-0" />
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground/60 hover:text-red-400 hover:bg-red-500/10 text-xs font-bold uppercase tracking-wide h-8" onClick={() => logout()}>
            <LogOut className="h-3 w-3 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* ── Main Column ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 h-13 bg-[#07070d]/95 border-b border-white/5 backdrop-blur-xl flex items-center justify-between px-6 py-3 shrink-0 shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-bold text-muted-foreground/40 uppercase tracking-widest">Client</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground/30" />
            <span className="font-black text-white uppercase tracking-widest">{pageTitle}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" className="hidden md:flex items-center gap-1.5 px-3 h-7 rounded-lg bg-white/3 border border-white/8 text-[10px] font-bold text-muted-foreground hover:text-white hover:bg-white/8 transition-all uppercase tracking-wider">
              <Globe className="w-3 h-3" /> Website
            </Link>
            <Link href="/client/tickets/new">
              <Button size="sm" className="h-7 px-3 text-[10px] font-black uppercase tracking-wider bg-primary hover:bg-primary/90 text-white">
                <Headset className="w-3 h-3 mr-1" /> New Ticket
              </Button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-[#05050b] relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.03),transparent_60%)] pointer-events-none" />
          <PageTransition className="p-6 md:p-8 relative z-10">
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
