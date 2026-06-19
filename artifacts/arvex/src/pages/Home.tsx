import { Navbar, Footer } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useGetPublicStats, useGetPartners } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Shield, Zap, Server, Globe, Headset, HardDrive, Cpu, Bot } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";

export default function Home() {
  const { data: stats } = useGetPublicStats();
  const { data: partners } = useGetPartners();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 scanline z-20 pointer-events-none opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="container relative z-30 mx-auto px-4 text-center">
            <PageTransition>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-8 border-glow">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold tracking-widest text-primary uppercase">GAME SERVERS — ALWAYS ONLINE</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white glow-text mb-6 uppercase">
                Enterprise Hosting <br />
                <span className="text-primary relative inline-block">
                  Solutions
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-full blur-[1px]"></span>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
                High-performance VPS, Minecraft, Bot, and Dedicated infrastructure built on ultra-fast NVMe arrays. Join the elite.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="btn-glow bg-primary hover:bg-primary/90 text-white text-lg px-10 h-14 font-bold tracking-wide uppercase transition-all duration-300 hover:scale-105">
                    Deploy Now
                  </Button>
                </Link>
                <Link href="/vps">
                  <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 text-lg px-8 h-14 glass-panel font-bold tracking-wide uppercase transition-all duration-300 hover:border-primary/50">
                    View Plans
                  </Button>
                </Link>
              </div>
            </PageTransition>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 relative z-20 border-b border-white/5 bg-black/40 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Active Players", value: stats?.activeCustomers || "50,000+" },
                { label: "Live Nodes", value: stats?.activeServers || "12,000+" },
                { label: "Uptime", value: `${stats?.uptimePercent || 99.99}%` },
                { label: "Support", value: stats?.supportAvailability || "24/7/365" }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center glass-panel p-6 rounded-xl border-glow relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="text-4xl md:text-5xl font-black text-white glow-text mb-2 tracking-tighter">{stat.value}</div>
                  <div className="text-xs font-bold text-primary/80 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-32 relative z-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white glow-text mb-4 uppercase tracking-tight">Select Your Arsenal</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto font-medium">Choose the perfect environment for your workload. Built for extreme performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { title: "VPS Hosting", href: "/vps", icon: Server, desc: "High-performance virtual private servers with full root access." },
                { title: "Minecraft", href: "/minecraft", icon: HardDrive, desc: "Ultra-low latency game servers with DDoS protection." },
                { title: "Bot Hosting", href: "/bot-hosting", icon: Bot, desc: "24/7 reliable hosting for Discord bots and automation." },
                { title: "VDS Hosting", href: "/vds", icon: Cpu, desc: "Virtual dedicated servers with dedicated CPU cores." },
                { title: "Web Hosting", href: "/web-hosting", icon: Globe, desc: "Blazing fast cPanel web hosting for your community sites." },
              ].map((svc, i) => {
                const Icon = svc.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link href={svc.href} className="block group">
                      <div className="glass-panel p-8 rounded-2xl h-full flex flex-col transition-all duration-300 hover:-translate-y-2 border-glow hover:bg-card/80 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] group-hover:bg-primary/20 transition-all duration-500" />
                        <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors z-10">
                          <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight z-10">{svc.title}</h3>
                        <p className="text-muted-foreground mb-8 flex-1 z-10 font-medium">{svc.desc}</p>
                        <div className="text-primary font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all z-10 uppercase tracking-wider">
                          Deploy Now <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Game Servers Choose ArveX */}
        <section className="py-24 bg-card border-y border-primary/20 relative z-20 overflow-hidden">
          <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-white glow-text mb-4 uppercase tracking-tight">Why Elite Gamers Choose ArveX</h2>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
               {[
                 { icon: Zap, title: "Zero Lag Infrastructure", desc: "Pure NVMe SSDs and high-clock CPUs ensure your server never skips a tick." },
                 { icon: Server, title: "Instant Deployment", desc: "Automated provisioning means your server is online and ready within seconds." },
                 { icon: Headset, title: "24/7 Battle-Ready Support", desc: "Our sysadmins are gamers too. We're here to help you around the clock." },
               ].map((feat, i) => {
                 const Icon = feat.icon;
                 return (
                   <div key={i} className="flex flex-col items-center text-center">
                     <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 border-glow">
                       <Icon className="w-8 h-8 text-primary" />
                     </div>
                     <h4 className="text-xl font-black text-white mb-3 uppercase tracking-tight">{feat.title}</h4>
                     <p className="text-muted-foreground font-medium leading-relaxed">{feat.desc}</p>
                   </div>
                 );
               })}
             </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-16 relative z-20 border-b border-white/5 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-8 inline-block border-b-2 border-primary pb-2">Trusted By The Best</h3>
            {/* Add partner logos here if available */}
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 relative z-20 overflow-hidden bg-black">
          <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter glow-text">Ready to Dominate?</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium">Deploy your premium infrastructure in seconds and experience the ArveX difference today.</p>
            <Link href="/register">
              <Button size="lg" className="btn-glow bg-primary hover:bg-primary/90 text-white text-xl px-12 h-16 font-black uppercase tracking-widest">
                Create Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
}
