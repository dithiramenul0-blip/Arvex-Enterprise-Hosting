import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Users, Server, Ticket, Settings, LogOut, ArrowLeft,
  Building, Zap, Cpu, Terminal, Globe, Paintbrush, BarChart3, Tag,
  Megaphone, ShieldCheck, Mail, ChevronDown, ChevronRight, Search,
  MessageSquare, HardDrive, CreditCard, FileText, Webhook, Wrench
} from "lucide-react";
import { ReactNode, useState } from "react";
import { PageTransition } from "./PageTransition";

interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
  children?: NavLink[];
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
      { href: "/admin/branding", label: "Branding & Maintenance", icon: Wrench },
      { href: "/admin/seo", label: "SEO Manager", icon: Search },
      { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
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
      { href: "/admin/coupons", label: "Coupon Manager", icon: Tag },
      { href: "/admin/plans", label: "Plan Manager", icon: Settings },
      { href: "/admin/plan-mappings", label: "Plan Mappings", icon: Settings },
    ],
  },
  {
    section: "Services",
    links: [
      { href: "/admin/services", label: "Services", icon: Server },
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
    section: "Partners & Content",
    links: [
      { href: "/admin/partners", label: "Partners", icon: Building },
    ],
  },
  {
    section: "System",
    links: [
      { href: "/admin/audit-logs", label: "Audit Logs", icon: FileText },
    ],
  },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  if (!user || user.role !== "admin") return null;

  const toggleSection = (s: string) =>
    setCollapsed(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; });

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-60 bg-[#080808] border-r border-white/5 flex flex-col z-20 shadow-[10px_0_40px_rgba(0,0,0,0.6)]">
        <div className="p-5 border-b border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
          <Link href="/" className="flex items-center gap-3 relative z-10 group">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:border-primary transition-all duration-300">
              <ShieldIcon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
            </div>
            <div>
              <div className="font-black text-lg tracking-tighter text-white glow-text uppercase">ArveX</div>
              <div className="text-[9px] font-bold text-primary uppercase tracking-widest">Admin Panel</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto space-y-0.5 scrollbar-thin">
          {NAV_SECTIONS.map(({ section, links }) => (
            <div key={section}>
              <button
                onClick={() => toggleSection(section)}
                className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest hover:text-muted-foreground transition-colors"
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
                    className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                      active
                        ? "bg-primary/15 text-primary border-l-2 border-primary shadow-[inset_0_0_15px_rgba(124,58,237,0.1)]"
                        : "text-muted-foreground/60 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${active ? "drop-shadow-[0_0_6px_rgba(124,58,237,0.8)]" : ""}`} />
                    <span className="truncate">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5 space-y-2 bg-black/40">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/3">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-xs shrink-0">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white font-bold text-xs truncate">{user.firstName} {user.lastName}</div>
              <div className="text-primary/60 text-[10px] font-bold uppercase tracking-wider">Super Admin</div>
            </div>
          </div>
          <Link href="/client">
            <Button variant="outline" className="w-full justify-start text-muted-foreground border-white/5 hover:bg-primary/10 hover:text-white text-xs font-bold uppercase tracking-wide hover:border-primary/30 h-9">
              <ArrowLeft className="h-3.5 w-3.5 mr-2 shrink-0" />
              Client Area
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground/60 hover:text-red-400 hover:bg-red-500/10 text-xs font-bold uppercase tracking-wide h-9" onClick={() => logout()}>
            <LogOut className="h-3.5 w-3.5 mr-2 shrink-0" />
            Disconnect
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-black relative min-h-screen">
        <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />
        <PageTransition className="p-6 md:p-10 relative z-10">
          {children}
        </PageTransition>
      </main>
    </div>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}
