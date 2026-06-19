import { Navbar, Footer } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useGetPublicStats, useGetPartners } from "@workspace/api-client-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, Zap, Server, Globe, Headset, HardDrive, Cpu, Bot, ArrowRight, Wifi, Star, ChevronRight, Lock, BarChart3 } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { useRef } from "react";

const SERVICE_IMAGES: Record<string, string> = {
  vps: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
  minecraft: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80",
  bot: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
  vds: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
  web: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
  v2ray: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
};

const SERVICES = [
  { key: "vps", title: "VPS Hosting", href: "/vps", icon: Server, desc: "Root access VPS with NVMe SSD, DDoS protection, and instant deploy.", badge: "FROM $4.99/MO" },
  { key: "minecraft", title: "Minecraft", href: "/minecraft", icon: HardDrive, desc: "Ultra-low latency game servers with mod support and auto-backups.", badge: "FROM $2.99/MO" },
  { key: "bot", title: "Bot Hosting", href: "/bot-hosting", icon: Bot, desc: "24/7 uptime for Discord bots, automation, and Node.js projects.", badge: "FROM $1.99/MO" },
  { key: "vds", title: "VDS Hosting", href: "/vds", icon: Cpu, desc: "Dedicated CPU cores and guaranteed RAM for mission-critical workloads.", badge: "FROM $9.99/MO" },
  { key: "web", title: "Web Hosting", href: "/web-hosting", icon: Globe, desc: "cPanel web hosting with unlimited subdomains and 1-click WordPress.", badge: "FROM $2.49/MO" },
  { key: "v2ray", title: "V2Ray Proxy", href: "/v2ray", icon: Wifi, desc: "Enterprise-grade VMess, VLess and Shadowsocks proxy infrastructure.", badge: "FROM $3.99/MO" },
];

const FEATURES = [
  { icon: Zap, title: "Zero-Lag NVMe Infrastructure", desc: "Pure NVMe SSD arrays deliver sub-millisecond I/O so your server never stutters." },
  { icon: Shield, title: "10 Tbps DDoS Shield", desc: "Always-on volumetric and L7 protection keeps your services online 24/7." },
  { icon: Server, title: "Instant Deployment", desc: "Automated provisioning via Pterodactyl and Proxmox — live in under 60 seconds." },
  { icon: BarChart3, title: "99.99% Uptime SLA", desc: "Redundant power, multi-gig uplinks, and real-time monitoring back every plan." },
  { icon: Lock, title: "Encrypted Backups", desc: "Daily automatic encrypted snapshots with one-click point-in-time restore." },
  { icon: Headset, title: "24/7 Expert Support", desc: "Our sysadmins and gamers are online around the clock — no bots, just humans." },
];

export default function Home() {
  const { data: stats } = useGetPublicStats();
  const { data: partners } = useGetPartners();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const partnerList = partners ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section ref={heroRef} className="relative h-[95vh] min-h-[650px] flex items-center justify-center overflow-hidden border-b border-white/5">
          <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=80)` }}
            />
            <div className="absolute inset-0 bg-background/85" />
            <div className="hero-grid absolute inset-0" />
          </motion.div>

          <div className="absolute inset-0 scanline z-10 pointer-events-none opacity-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary/15 rounded-full blur-[140px] pointer-events-none z-10" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none z-10" />

          <motion.div style={{ opacity: heroOpacity }} className="container relative z-20 mx-auto px-4 text-center">
            <PageTransition>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 border-glow"
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                <span className="text-xs font-bold tracking-widest text-primary uppercase">Game Servers — Always Online</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-4 uppercase leading-none"
              >
                Enterprise{" "}
                <span className="shimmer-text">Hosting</span>
                <br />
                <span className="text-white">Solutions</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed font-medium"
              >
                High-performance VPS, Minecraft, Bot, VDS, Web, and V2Ray infrastructure built on ultra-fast NVMe arrays. Join over{" "}
                <span className="text-primary font-bold">50,000 players</span> trusting ArveX.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center justify-center gap-4"
              >
                <Link href="/register">
                  <Button size="lg" className="btn-glow bg-primary hover:bg-primary/90 text-white text-lg px-10 h-14 font-bold tracking-wide uppercase transition-all duration-300 hover:scale-105">
                    Deploy Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/vps">
                  <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 text-lg px-8 h-14 glass-panel font-bold tracking-wide uppercase transition-all duration-300 hover:border-primary/60">
                    View Plans
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-16 flex flex-wrap items-center justify-center gap-8"
              >
                {["99.99% Uptime", "10 Tbps DDoS", "24/7 Support", "NVMe SSD"].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    {badge}
                  </div>
                ))}
              </motion.div>
            </PageTransition>
          </motion.div>
        </section>

        {/* ── Stats ── */}
        <section className="py-16 relative z-20 border-b border-white/5 bg-black/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Active Players", value: stats?.activeCustomers ?? "50,000+" },
                { label: "Live Nodes", value: stats?.activeServers ?? "12,000+" },
                { label: "Uptime", value: `${stats?.uptimePercent ?? 99.99}%` },
                { label: "Support", value: stats?.supportAvailability ?? "24/7/365" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center glass-panel p-6 rounded-2xl border-glow relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter glow-text">{stat.value}</div>
                  <div className="text-xs font-bold text-primary/80 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Services Grid ── */}
        <section className="py-28 relative z-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-block px-4 py-1 rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary uppercase tracking-widest mb-4">
                Our Services
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white glow-text mb-4 uppercase tracking-tight">
                Select Your Arsenal
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto font-medium text-lg">
                Six battle-tested hosting solutions. Click any card to explore plans and deploy instantly.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {SERVICES.map((svc, i) => {
                const Icon = svc.icon;
                return (
                  <motion.div
                    key={svc.key}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                  >
                    <Link href={svc.href} className="block group service-card">
                      <div className="relative rounded-2xl overflow-hidden h-72 border border-white/10 group-hover:border-primary/50 transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(124,58,237,0.25)] group-hover:-translate-y-2">
                        <img
                          src={SERVICE_IMAGES[svc.key]}
                          alt={svc.title}
                          className="service-card-image absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="absolute top-4 left-4">
                          <span className="inline-block px-3 py-1 rounded-full bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest border-glow">
                            {svc.badge}
                          </span>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center group-hover:bg-primary/40 transition-colors">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">{svc.title}</h3>
                          </div>
                          <p className="text-sm text-white/70 mb-4 font-medium leading-relaxed">{svc.desc}</p>
                          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider group-hover:gap-3 transition-all">
                            View Plans <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-24 relative z-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-block px-4 py-1 rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary uppercase tracking-widest mb-4">
                Why ArveX
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white glow-text mb-4 uppercase tracking-tight">
                Built For Perfectionists
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {FEATURES.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-panel p-8 rounded-2xl group hover:border-glow transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-[40px] group-hover:bg-primary/20 transition-all duration-500" />
                    <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h4 className="text-lg font-black text-white mb-3 uppercase tracking-tight">{feat.title}</h4>
                    <p className="text-muted-foreground font-medium leading-relaxed text-sm">{feat.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Partners / Trusted By ── */}
        {partnerList.length > 0 && (
          <section className="py-20 relative z-20 overflow-hidden border-y border-white/5 bg-black/30">
            <div className="container mx-auto px-4 text-center mb-10">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Trusted By The Best</span>
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                  YouTubers & Studios That Trust ArveX
                </h3>
              </motion.div>
            </div>

            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

              <div className="flex gap-0 overflow-hidden">
                <div className="flex gap-8 animate-scroll shrink-0">
                  {[...partnerList, ...partnerList].map((p, i) => (
                    <a
                      key={i}
                      href={p.websiteUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 flex flex-col items-center gap-3 group"
                    >
                      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300">
                        {p.logoUrl ? (
                          <img src={p.logoUrl} alt={p.name} className="w-16 h-16 object-contain rounded-xl" />
                        ) : (
                          <span className="text-2xl font-black text-primary">{p.name[0]}</span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground group-hover:text-white transition-colors uppercase tracking-wide whitespace-nowrap">
                        {p.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Pricing Teaser ── */}
        <section className="py-24 relative z-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-black text-white glow-text uppercase tracking-tight mb-4">
                Starting From Just
              </h2>
              <div className="text-7xl md:text-9xl font-black shimmer-text leading-none mb-4">$1.99</div>
              <p className="text-muted-foreground text-lg font-medium max-w-xl mx-auto">
                /month — No contracts. No hidden fees. Cancel anytime.
              </p>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-4">
              {SERVICES.map((svc) => (
                <Link key={svc.key} href={svc.href}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-6 py-3 rounded-xl glass-panel border border-white/10 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] transition-all cursor-pointer font-bold text-sm text-white uppercase tracking-wide"
                  >
                    {svc.title}
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-32 relative z-20 overflow-hidden">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80)` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/70" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
          <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 border-glow">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                <span className="text-xs font-bold tracking-widest text-primary uppercase">Instant Deployment Available</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter glow-text">
                Ready to Dominate?
              </h2>
              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium">
                Deploy your premium infrastructure in seconds and experience the ArveX difference today.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="btn-glow bg-primary hover:bg-primary/90 text-white text-xl px-12 h-16 font-black uppercase tracking-widest hover:scale-105 transition-all duration-300">
                    Create Account Free
                  </Button>
                </Link>
                <Link href="/minecraft">
                  <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 text-xl px-10 h-16 glass-panel font-bold tracking-wide uppercase">
                    Explore Minecraft
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
