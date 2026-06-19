import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Server, Menu, X, Shield, Cpu, Activity, LogOut } from "lucide-react";
import { useState } from "react";
import { SiDiscord } from "react-icons/si";

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
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/90 backdrop-blur-xl border-t-2 border-t-primary">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:border-primary transition-all duration-300">
              <Server className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
            </div>
            <span className="font-black text-2xl tracking-tighter glow-text uppercase">ArveX</span>
          </Link>
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-md transition-colors group overflow-hidden ${isActive ? "text-primary" : "text-muted-foreground hover:text-white"}`}
                >
                  <span className="relative z-10">{link.label}</span>
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                  {isActive && <div className="absolute inset-0 bg-primary/5 z-0 rounded-md" />}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link href="/admin" className="text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">
                  Admin
                </Link>
              )}
              <Link href="/client">
                <Button variant="outline" className="border-primary/50 hover:bg-primary/20 hover:text-white font-bold uppercase tracking-wider h-10">
                  Client Area
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => logout()} className="hover:bg-destructive/20 hover:text-destructive h-10 w-10">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-white transition-colors px-4">
                Login
              </Link>
              <Link href="/register">
                <Button className="btn-glow bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-10 px-6 animate-pulse-glow">
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
        <div className="md:hidden border-b border-primary/20 bg-card/95 backdrop-blur-xl absolute w-full">
          <div className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="px-4 py-4 rounded-md text-sm font-bold uppercase tracking-wider hover:bg-primary/10 border-l-2 border-transparent hover:border-primary hover:text-primary transition-all"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-2" />
            {user ? (
              <>
                <Link href="/client" className="px-4 py-4 rounded-md text-sm font-bold uppercase tracking-wider text-primary hover:bg-primary/10" onClick={() => setMobileOpen(false)}>
                  Client Area
                </Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="px-4 py-4 rounded-md text-sm font-bold uppercase tracking-wider text-destructive hover:bg-destructive/10 text-left transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-4 rounded-md text-sm font-bold uppercase tracking-wider hover:bg-white/5" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="px-4 py-4 rounded-md text-sm font-bold uppercase tracking-wider text-primary hover:bg-primary/10" onClick={() => setMobileOpen(false)}>
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
    <footer className="border-t border-primary/20 bg-black py-16 mt-20 relative overflow-hidden">
      <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/50">
              <Server className="h-7 w-7 text-primary" />
            </div>
            <div>
              <div className="font-black text-2xl tracking-tighter text-white glow-text uppercase">ArveX</div>
              <div className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Hosting Network</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            Powering the world's best game servers. Elite infrastructure for communities that demand perfection.
          </p>
        </div>
        <div>
          <h4 className="font-black text-white mb-6 uppercase tracking-widest text-sm border-b border-white/10 pb-3 inline-block">Services</h4>
          <ul className="space-y-3 text-sm font-medium text-muted-foreground">
            <li><Link href="/vps" className="hover:text-primary hover:translate-x-1 inline-block transition-all">VPS Hosting</Link></li>
            <li><Link href="/minecraft" className="hover:text-primary hover:translate-x-1 inline-block transition-all">Minecraft Hosting</Link></li>
            <li><Link href="/bot-hosting" className="hover:text-primary hover:translate-x-1 inline-block transition-all">Bot Hosting</Link></li>
            <li><Link href="/vds" className="hover:text-primary hover:translate-x-1 inline-block transition-all">VDS Hosting</Link></li>
            <li><Link href="/web-hosting" className="hover:text-primary hover:translate-x-1 inline-block transition-all">Web Hosting</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black text-white mb-6 uppercase tracking-widest text-sm border-b border-white/10 pb-3 inline-block">Legal</h4>
          <ul className="space-y-3 text-sm font-medium text-muted-foreground">
            <li><Link href="/terms" className="hover:text-primary hover:translate-x-1 inline-block transition-all">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-primary hover:translate-x-1 inline-block transition-all">Privacy Policy</Link></li>
            <li><Link href="/refund" className="hover:text-primary hover:translate-x-1 inline-block transition-all">Refund Policy</Link></li>
            <li><Link href="/sla" className="hover:text-primary hover:translate-x-1 inline-block transition-all">SLA Agreement</Link></li>
            <li><Link href="/aup" className="hover:text-primary hover:translate-x-1 inline-block transition-all">Acceptable Use</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black text-white mb-6 uppercase tracking-widest text-sm border-b border-white/10 pb-3 inline-block">Comm Center</h4>
          <ul className="space-y-4 text-sm font-medium text-muted-foreground">
            <li className="flex items-center gap-2"><span className="text-primary font-bold">HQ:</span> support@arvexhosting.com</li>
            <li className="flex items-center gap-2"><span className="text-primary font-bold">BILLING:</span> billing@arvexhosting.com</li>
            <li className="pt-4">
              <Button variant="outline" className="w-full border-[#5865F2]/50 text-white bg-[#5865F2]/10 hover:bg-[#5865F2] hover:text-white hover:border-[#5865F2] transition-all h-12 font-bold tracking-wide">
                <SiDiscord className="w-5 h-5 mr-2" />
                Join Our Discord
              </Button>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground relative z-10">
        <p>&copy; 2026 ArveX Hosting™. All Rights Reserved.</p>
        <div className="flex gap-6 mt-6 md:mt-0">
          <Shield className="h-5 w-5 text-primary/50 hover:text-primary transition-colors cursor-pointer" />
          <Cpu className="h-5 w-5 text-primary/50 hover:text-primary transition-colors cursor-pointer" />
          <Activity className="h-5 w-5 text-primary/50 hover:text-primary transition-colors cursor-pointer" />
        </div>
      </div>
    </footer>
  );
}
