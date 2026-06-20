import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Server, ShoppingCart, Ticket, User as UserIcon,
  LogOut, Shield, Bell, History, Code, Download, ChevronDown, ChevronRight
} from "lucide-react";
import { ReactNode, useState } from "react";
import { PageTransition } from "./PageTransition";

interface NavLink { href: string; label: string; icon: React.ElementType }

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

export function ClientLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  if (!user) return null;

  const toggleSection = (s: string) =>
    setCollapsed(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; });

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-60 bg-[#080808] border-r border-white/5 flex flex-col">
        <div className="p-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:border-primary transition-all">
              <Server className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-black text-lg tracking-tighter text-white uppercase">ArveX</div>
              <div className="text-[9px] font-bold text-primary uppercase tracking-widest">Client Area</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto space-y-0.5">
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
                        ? "bg-primary/15 text-primary border-l-2 border-primary"
                        : "text-muted-foreground/60 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}

          {user.role === "admin" && (
            <div>
              <div className="px-4 py-2 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Admin</div>
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-xs font-bold uppercase tracking-wide text-muted-foreground/60 hover:bg-primary/10 hover:text-primary border-l-2 border-transparent transition-all"
              >
                <Shield className="h-4 w-4 shrink-0" />
                Admin Panel
              </Link>
            </div>
          )}
        </nav>

        <div className="p-3 border-t border-white/5 space-y-2 bg-black/40">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/3">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-xs shrink-0">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-white text-xs truncate">{user.firstName} {user.lastName}</div>
              <div className="text-muted-foreground text-[10px] truncate">{user.email}</div>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground/60 hover:text-red-400 hover:bg-red-500/10 text-xs font-bold uppercase tracking-wide h-9" onClick={() => logout()}>
            <LogOut className="h-3.5 w-3.5 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-black relative">
        <div className="absolute inset-0 scanline opacity-[0.02] pointer-events-none" />
        <PageTransition className="p-6 md:p-8 relative z-10">
          {children}
        </PageTransition>
      </main>
    </div>
  );
}
