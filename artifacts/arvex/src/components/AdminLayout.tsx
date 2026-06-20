import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Server, Ticket, Settings, LogOut, ArrowLeft, Building, Zap, Cpu, Terminal, Globe, Paintbrush } from "lucide-react";
import { ReactNode } from "react";
import { PageTransition } from "./PageTransition";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  if (!user || user.role !== 'admin') return null; 

  const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/site-settings", label: "Site Customizer", icon: Paintbrush },
    { href: "/admin/content", label: "Content Pages", icon: Globe },
    { href: "/admin/provisions", label: "Server Control", icon: Terminal },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/plans", label: "Plans", icon: Settings },
    { href: "/admin/plan-mappings", label: "Plan Mappings", icon: Settings },
    { href: "/admin/services", label: "Services", icon: Server },
    { href: "/admin/tickets", label: "Tickets", icon: Ticket },
    { href: "/admin/partners", label: "Partners", icon: Building },
    { href: "/admin/pterodactyl", label: "Pterodactyl", icon: Zap },
    { href: "/admin/proxmox", label: "Proxmox", icon: Cpu },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0A0A0A] border-r border-red-900/20 flex flex-col z-20 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
        <div className="p-6 border-b border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
          <Link href="/" className="flex items-center gap-3 relative z-10 group">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:border-primary transition-all duration-300">
              <Shield className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
            </div>
            <div>
              <div className="font-black text-xl tracking-tighter text-white glow-text uppercase">ArveX</div>
              <div className="text-[10px] font-bold text-primary uppercase tracking-widest">Admin Uplink</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const active = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                  active ? "bg-primary/20 text-primary border-l-2 border-primary shadow-[inset_0_0_20px_rgba(139,0,0,0.1)]" : "text-muted-foreground hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "drop-shadow-[0_0_8px_rgba(139,0,0,0.8)]" : ""}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-3 bg-black/40">
          <Link href="/client">
            <Button variant="outline" className="w-full justify-start text-muted-foreground border-white/10 hover:bg-primary/20 hover:text-white font-bold uppercase tracking-wider hover:border-primary/50">
              <ArrowLeft className="h-4 w-4 mr-3" />
              Client Area
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-bold uppercase tracking-wider" onClick={() => logout()}>
            <LogOut className="h-4 w-4 mr-3" />
            Disconnect
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-black relative">
        <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />
        <PageTransition className="p-6 md:p-10 relative z-10">
          {children}
        </PageTransition>
      </main>
    </div>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}
