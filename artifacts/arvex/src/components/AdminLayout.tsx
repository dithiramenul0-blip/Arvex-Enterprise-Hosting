import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Server, Ticket, Settings, LogOut, ArrowLeft, Building } from "lucide-react";
import { ReactNode } from "react";
import { PageTransition } from "./PageTransition";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  if (!user || user.role !== 'admin') return null; 

  const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/plans", label: "Plans", icon: Settings },
    { href: "/admin/services", label: "Services", icon: Server },
    { href: "/admin/tickets", label: "Tickets", icon: Ticket },
    { href: "/admin/partners", label: "Partners", icon: Building },
    { href: "/admin/content", label: "Content Pages", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0A0A0A] border-r border-red-900/20 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight text-white glow-text">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active ? "bg-primary/20 text-primary border-l-2 border-primary" : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/client">
            <Button variant="outline" className="w-full justify-start text-muted-foreground border-white/10 hover:bg-white/5 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Client Area
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => logout()}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-black">
        <PageTransition className="p-6 md:p-8">
          {children}
        </PageTransition>
      </main>
    </div>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}
