import { ParticleCanvas } from "@/components/ParticleCanvas";
import { Navbar, Footer } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useGetPublicStats, useGetPartners } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Shield, Zap, Server, Globe, Headset, HardDrive } from "lucide-react";
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
          <ParticleCanvas />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10" />
          
          <div className="container relative z-20 mx-auto px-4 text-center">
            <PageTransition>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white glow-text mb-6">
                Enterprise Hosting Solutions <br />
                <span className="text-primary">For Modern Businesses</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
                Powerful VPS, Minecraft Hosting, Bot Hosting, Web Hosting, Dedicated Solutions & Infrastructure Services built on ultra-fast NVMe storage.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white glow-border text-lg px-8 h-14">
                    Get Started
                  </Button>
                </Link>
                <Link href="/vps">
                  <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 text-lg px-8 h-14 glass-panel">
                    View Plans
                  </Button>
                </Link>
                <Link href="/client">
                  <Button size="lg" variant="ghost" className="text-muted-foreground hover:text-white text-lg px-8 h-14">
                    Client Area
                  </Button>
                </Link>
              </div>
            </PageTransition>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-card relative z-20 border-b border-white/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Active Customers", value: stats?.activeCustomers || "5,000+" },
                { label: "Active Servers", value: stats?.activeServers || "12,000+" },
                { label: "Uptime", value: `${stats?.uptimePercent || 99.99}%` },
                { label: "Support", value: stats?.supportAvailability || "24/7/365" }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm font-medium text-primary uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-32 relative z-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Premium Infrastructure</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Choose the perfect environment for your workload. All services are backed by our enterprise-grade network.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {[
                { title: "VPS Hosting", href: "/vps", icon: Server, desc: "High-performance virtual private servers with full root access." },
                { title: "Minecraft", href: "/minecraft", icon: HardDrive, desc: "Ultra-low latency game servers with DDoS protection." },
                { title: "Bot Hosting", href: "/bot-hosting", icon: Zap, desc: "24/7 reliable hosting for Discord bots and automation." },
                { title: "VDS Hosting", href: "/vds", icon: Cpu, desc: "Virtual dedicated servers with dedicated resources." },
                { title: "Web Hosting", href: "/web-hosting", icon: Globe, desc: "Blazing fast cPanel web hosting for your sites." },
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
                      <div className="glass-panel p-6 rounded-xl h-full flex flex-col transition-all duration-300 hover:border-primary/50 hover:bg-card/60 glow-border">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/40 transition-colors">
                          <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{svc.title}</h3>
                        <p className="text-sm text-muted-foreground mb-6 flex-1">{svc.desc}</p>
                        <div className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                          View Plans <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-card border-y border-white/5 relative z-20">
          <div className="container mx-auto px-4">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 { icon: Shield, title: "DDoS Protection", desc: "Enterprise-grade mitigation capable of stopping multi-terabit attacks automatically." },
                 { icon: Activity, title: "99.9% Uptime SLA", desc: "We guarantee your services stay online with our financially backed Service Level Agreement." },
                 { icon: Headset, title: "24/7 Expert Support", desc: "Our team of infrastructure experts is available around the clock to assist you." },
                 { icon: HardDrive, title: "NVMe SSD Storage", desc: "Experience blazing fast read/write speeds with our pure NVMe SSD arrays." },
                 { icon: Globe, title: "Global Network", desc: "Low-latency routes with multiple Tier-1 transit providers globally." },
                 { icon: Zap, title: "Instant Setup", desc: "Services are provisioned automatically within seconds of payment confirmation." }
               ].map((feat, i) => {
                 const Icon = feat.icon;
                 return (
                   <div key={i} className="flex gap-4">
                     <div className="shrink-0 mt-1">
                       <Icon className="w-8 h-8 text-primary" />
                     </div>
                     <div>
                       <h4 className="text-lg font-bold text-white mb-2">{feat.title}</h4>
                       <p className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</p>
                     </div>
                   </div>
                 );
               })}
             </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 relative z-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">Deploy your infrastructure in seconds and experience the ArveX difference today.</p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 text-lg px-10 h-14 glow-border">
                Create an Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Activity({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
}

function ArrowRight({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
}

function Cpu({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className={className}><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>;
}
