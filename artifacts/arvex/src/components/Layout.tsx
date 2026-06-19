import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Server, Menu, X, Shield, Cpu, Activity, LogOut } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/vps", label: "VPS" },
    { href: "/minecraft", label: "Minecraft" },
    { href: "/bot-hosting", label: "Bot Hosting" },
    { href: "/vds", label: "VDS" },
    { href: "/web-hosting", label: "Web Hosting" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Server className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">ArveX</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-white/5 hover:text-primary ${location === link.href ? "text-primary" : "text-muted-foreground"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Admin
                </Link>
              )}
              <Link href="/client">
                <Button variant="outline" className="border-primary/50 hover:bg-primary/20 hover:text-white">
                  Client Area
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => logout()}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Login
              </Link>
              <Link href="/register">
                <Button className="bg-primary hover:bg-primary/90 text-white border border-primary-foreground/20 shadow-[0_0_15px_rgba(139,0,0,0.5)]">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 text-muted-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-b border-white/10 bg-card">
          <div className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="px-4 py-3 rounded-md text-sm font-medium hover:bg-white/5"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-2" />
            {user ? (
              <>
                <Link href="/client" className="px-4 py-3 rounded-md text-sm font-medium text-primary hover:bg-white/5" onClick={() => setMobileOpen(false)}>
                  Client Area
                </Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="px-4 py-3 rounded-md text-sm font-medium text-destructive hover:bg-white/5 text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-3 rounded-md text-sm font-medium hover:bg-white/5" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="px-4 py-3 rounded-md text-sm font-medium text-primary hover:bg-white/5" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-card py-12 mt-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Server className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight text-white">ArveX</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Enterprise hosting solutions for serious businesses and developers. Power, reliability, and performance.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Services</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/vps" className="hover:text-primary transition-colors">VPS Hosting</Link></li>
            <li><Link href="/minecraft" className="hover:text-primary transition-colors">Minecraft Hosting</Link></li>
            <li><Link href="/bot-hosting" className="hover:text-primary transition-colors">Bot Hosting</Link></li>
            <li><Link href="/vds" className="hover:text-primary transition-colors">VDS Hosting</Link></li>
            <li><Link href="/web-hosting" className="hover:text-primary transition-colors">Web Hosting</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/refund" className="hover:text-primary transition-colors">Refund Policy</Link></li>
            <li><Link href="/sla" className="hover:text-primary transition-colors">SLA Agreement</Link></li>
            <li><Link href="/aup" className="hover:text-primary transition-colors">Acceptable Use</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Support: support@arvex.host</li>
            <li>Billing: billing@arvex.host</li>
            <li className="pt-4">
              <Button variant="outline" className="w-full border-[#5865F2] text-[#5865F2] hover:bg-[#5865F2] hover:text-white">
                Join our Discord
              </Button>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ArveX Hosting™. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Shield className="h-4 w-4" />
          <Cpu className="h-4 w-4" />
          <Activity className="h-4 w-4" />
        </div>
      </div>
    </footer>
  );
}
