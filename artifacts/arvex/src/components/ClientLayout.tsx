import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Server, ShoppingCart, Ticket, User as UserIcon, LogOut, Shield } from "lucide-react";
import { ReactNode } from "react";
import { PageTransition } from "./PageTransition";

export function ClientLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  if (!user) return null; // Should be handled by router guard

  const links = [
    { href: "/client", label: "Dashboard", icon: LayoutDashboard },
    { href: "/client/services", label: "My Services", icon: Server },
    { href: "/client/orders", label: "Orders", icon: ShoppingCart },
    { href: "/client/tickets", label: "Support Tickets", icon: Ticket },
    { href: "/client/profile", label: "Profile Settings", icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <Server className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight text-white">ArveX</span>
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
                  active ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
          {user.role === 'admin' && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 mt-4 rounded-md text-sm font-medium text-accent hover:bg-white/5 hover:text-accent-foreground transition-colors"
            >
              <Shield className="h-4 w-4" />
              Admin Panel
            </Link>
          )}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="text-sm">
              <div className="font-medium text-white">{user.firstName} {user.lastName}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => logout()}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <PageTransition className="p-6 md:p-8">
          {children}
        </PageTransition>
      </main>
    </div>
  );
}
