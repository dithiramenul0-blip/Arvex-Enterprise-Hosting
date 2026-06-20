import { Navbar, Footer } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useGetPublicStats, useGetPartners } from "@workspace/api-client-react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Shield, Zap, Server, Globe, Headset, HardDrive, Cpu, Bot, ArrowRight,
  Wifi, Star, ChevronRight, Lock, BarChart3, MapPin, CheckCircle2,
  Quote, ChevronDown, Clock, Network, Database, RefreshCw, Eye, Layers,
  GitBranch, Terminal, CloudLightning, Gauge, Award, MessageSquare
} from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { useRef, useState } from "react";

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
  { icon: Network, title: "Anycast Network", desc: "Global anycast routing ensures the lowest latency to your users worldwide." },
  { icon: RefreshCw, title: "Auto-Scaling Resources", desc: "Scale CPU and RAM up or down instantly without migrating your server." },
  { icon: Eye, title: "Real-Time Monitoring", desc: "Full visibility into CPU, RAM, bandwidth, and network with live dashboards." },
  { icon: Database, title: "RAID-10 Storage", desc: "RAID-10 arrays with hot-swap drives ensure zero data loss under any failure." },
  { icon: CloudLightning, title: "Pterodactyl Panel", desc: "Powerful game panel with file manager, console access, and mod installation." },
  { icon: Terminal, title: "Full Root Access", desc: "SSH root access on VPS/VDS — install anything, configure everything." },
];

const LOCATIONS = [
  { city: "New York", country: "United States", flag: "🇺🇸", region: "North America", ping: "~2ms", status: "online", nodes: 48 },
  { city: "Los Angeles", country: "United States", flag: "🇺🇸", region: "North America", ping: "~5ms", status: "online", nodes: 32 },
  { city: "London", country: "United Kingdom", flag: "🇬🇧", region: "Europe", ping: "~8ms", status: "online", nodes: 40 },
  { city: "Frankfurt", country: "Germany", flag: "🇩🇪", region: "Europe", ping: "~10ms", status: "online", nodes: 56 },
  { city: "Amsterdam", country: "Netherlands", flag: "🇳🇱", region: "Europe", ping: "~9ms", status: "online", nodes: 28 },
  { city: "Singapore", country: "Singapore", flag: "🇸🇬", region: "Asia Pacific", ping: "~15ms", status: "online", nodes: 36 },
  { city: "Tokyo", country: "Japan", flag: "🇯🇵", region: "Asia Pacific", ping: "~18ms", status: "online", nodes: 24 },
  { city: "Sydney", country: "Australia", flag: "🇦🇺", region: "Asia Pacific", ping: "~20ms", status: "online", nodes: 20 },
  { city: "São Paulo", country: "Brazil", flag: "🇧🇷", region: "South America", ping: "~12ms", status: "online", nodes: 18 },
  { city: "Toronto", country: "Canada", flag: "🇨🇦", region: "North America", ping: "~4ms", status: "online", nodes: 22 },
  { city: "Paris", country: "France", flag: "🇫🇷", region: "Europe", ping: "~11ms", status: "online", nodes: 30 },
  { city: "Mumbai", country: "India", flag: "🇮🇳", region: "Asia Pacific", ping: "~22ms", status: "online", nodes: 16 },
];

const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Minecraft Server Owner",
    avatar: "AR",
    text: "Switched from a competitor and the difference is night and day. Zero lag spikes, instant support, and the DDoS protection actually works. Our 500-player network runs flawlessly.",
    stars: 5,
    service: "Minecraft Hosting",
  },
  {
    name: "TechBot Studio",
    role: "Discord Bot Developer",
    avatar: "TB",
    text: "We host 12 production bots here. 99.9% uptime month after month. The dashboard is clean, deploys take seconds, and pricing is the best I've found anywhere.",
    stars: 5,
    service: "Bot Hosting",
  },
  {
    name: "Sarah K.",
    role: "SaaS Founder",
    avatar: "SK",
    text: "Moved our entire SaaS stack to ArveX VPS. Setup was effortless, root access is real, and NVMe performance is insane. Our app loads 3x faster than before.",
    stars: 5,
    service: "VPS Hosting",
  },
  {
    name: "GameZone Network",
    role: "Multi-Game Community",
    avatar: "GZ",
    text: "We run 20+ game servers across VPS and VDS. ArveX's team actually helped us configure everything. That kind of white-glove support at this price point is unmatched.",
    stars: 5,
    service: "VDS Hosting",
  },
  {
    name: "Mark T.",
    role: "WordPress Developer",
    avatar: "MT",
    text: "Web hosting with cPanel and 1-click WordPress makes client work so much faster. SSL provisioning is instant and the uptime has been rock solid for 18 months.",
    stars: 5,
    service: "Web Hosting",
  },
  {
    name: "ProxyMax Ltd.",
    role: "Network Engineer",
    avatar: "PM",
    text: "V2Ray performance is phenomenal. VMess throughput beats everything I've tested. The enterprise network stack and 10 Gbps ports make all the difference.",
    stars: 5,
    service: "V2Ray Proxy",
  },
];

const FAQS = [
  {
    q: "How fast is deployment after ordering?",
    a: "Most servers are provisioned automatically and live within 60 seconds of payment confirmation. VDS and custom configurations may take up to 5 minutes. You'll receive login credentials via email immediately."
  },
  {
    q: "What DDoS protection do you offer?",
    a: "All plans include our 10 Tbps always-on DDoS mitigation at no extra cost. We use multi-layer filtering including volumetric, protocol, and application-layer (L7) attack mitigation with automatic detection and null-routing."
  },
  {
    q: "Can I upgrade or downgrade my plan?",
    a: "Yes — plan upgrades and downgrades are available anytime from your client dashboard. Upgrades are instant. Downgrades apply at the end of your billing cycle with no data loss."
  },
  {
    q: "Do you offer a money-back guarantee?",
    a: "We offer a 3-day money-back guarantee on all new orders. If you're not satisfied, contact our billing team within 72 hours of your first order and we'll issue a full refund, no questions asked."
  },
  {
    q: "What control panel do you use?",
    a: "Game servers (Minecraft, etc.) use Pterodactyl panel — a modern, feature-rich panel with file manager, console, backups, and mod support. VPS/VDS use Proxmox with optional ISPConfig or DirectAdmin add-ons. Web hosting uses cPanel."
  },
  {
    q: "Do you support custom ISOs and operating systems?",
    a: "VPS and VDS plans support a wide range of operating systems including Ubuntu, Debian, CentOS, Rocky Linux, AlmaLinux, Fedora, and Windows Server. Custom ISO uploads are available on request."
  },
  {
    q: "Is there a setup fee?",
    a: "No setup fees, ever. The price you see is the price you pay. No contracts, no hidden charges, cancel anytime."
  },
  {
    q: "Where are your servers located?",
    a: "We have nodes in 12+ locations across North America, Europe, Asia Pacific, and South America. You can choose your preferred datacenter during checkout, and migrations between locations are available."
  },
];

const COMPARE_FEATURES = [
  { feature: "NVMe SSD Storage", arvex: true, competitor1: false, competitor2: true },
  { feature: "10 Tbps DDoS Protection", arvex: true, competitor1: false, competitor2: false },
  { feature: "Instant Deployment (<60s)", arvex: true, competitor1: false, competitor2: false },
  { feature: "24/7 Human Support", arvex: true, competitor1: true, competitor2: false },
  { feature: "99.99% Uptime SLA", arvex: true, competitor1: false, competitor2: true },
  { feature: "Free Daily Backups", arvex: true, competitor1: false, competitor2: false },
  { feature: "Anycast Global Network", arvex: true, competitor1: false, competitor2: false },
  { feature: "No Setup Fees", arvex: true, competitor1: false, competitor2: true },
  { feature: "Root/Admin Access", arvex: true, competitor1: true, competitor2: true },
  { feature: "Custom ISO Support", arvex: true, competitor1: false, competitor2: false },
];

export default function Home() {
  const { data: stats } = useGetPublicStats();
  const { data: partners } = useGetPartners();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [locationRegion, setLocationRegion] = useState("All");

  const partnerList = partners ?? [];
  const regions = ["All", "North America", "Europe", "Asia Pacific", "South America"];
  const filteredLocations = locationRegion === "All" ? LOCATIONS : LOCATIONS.filter(l => l.region === locationRegion);

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
                <span className="text-xs font-bold tracking-widest text-primary uppercase">12 Global Datacenters — Always Online</span>
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
                {["99.99% Uptime", "10 Tbps DDoS", "24/7 Support", "NVMe SSD", "12 Locations"].map((badge, i) => (
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
                { label: "Active Players", value: stats?.activeCustomers ?? "50,000+", icon: Award },
                { label: "Live Nodes", value: stats?.activeServers ?? "12,000+", icon: Server },
                { label: "Uptime", value: `${stats?.uptimePercent ?? 99.99}%`, icon: Gauge },
                { label: "Support", value: stats?.supportAvailability ?? "24/7/365", icon: Clock },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center glass-panel p-6 rounded-2xl border-glow relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Icon className="w-6 h-6 text-primary/60 mx-auto mb-2" />
                    <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter glow-text">{stat.value}</div>
                    <div className="text-xs font-bold text-primary/80 uppercase tracking-widest">{stat.label}</div>
                  </motion.div>
                );
              })}
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
              <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
                Every feature engineered to give you maximum performance, security, and control.
              </p>
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
                    transition={{ delay: i * 0.06 }}
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

        {/* ── Server Locations ── */}
        <section className="py-28 relative z-20 overflow-hidden border-y border-white/5">
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/8 rounded-full blur-[100px] pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-block px-4 py-1 rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary uppercase tracking-widest mb-4">
                Global Infrastructure
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white glow-text mb-4 uppercase tracking-tight">
                12+ Server Locations
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto font-medium text-lg">
                Deploy your server closest to your players. Ultra-low latency across 4 continents.
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setLocationRegion(region)}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    locationRegion === region
                      ? "bg-primary text-white border-glow shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                      : "glass-panel text-muted-foreground hover:text-white hover:border-primary/40"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {filteredLocations.map((loc, i) => (
                <motion.div
                  key={loc.city}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel p-5 rounded-2xl group hover:border-glow transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{loc.flag}</div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)] animate-pulse" />
                      <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Online</span>
                    </div>
                  </div>
                  <div className="font-black text-white text-lg uppercase tracking-tight leading-none mb-1">{loc.city}</div>
                  <div className="text-xs text-muted-foreground font-medium mb-4">{loc.country}</div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-primary/60" />
                      <span className="text-muted-foreground font-medium">{loc.region}</span>
                    </div>
                    <div className="font-black text-primary">{loc.ping}</div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Active Nodes</span>
                    <span className="text-white font-bold">{loc.nodes}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <div className="inline-flex items-center gap-8 glass-panel px-8 py-4 rounded-2xl">
                {[
                  { label: "Datacenters", value: "12+" },
                  { label: "Total Nodes", value: "370+" },
                  { label: "Avg Latency", value: "<20ms" },
                  { label: "Network", value: "10 Gbps" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-black text-white">{s.value}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
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

        {/* ── Testimonials ── */}
        <section className="py-28 relative z-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-block px-4 py-1 rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary uppercase tracking-widest mb-4">
                Customer Reviews
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white glow-text mb-4 uppercase tracking-tight">
                What Our Clients Say
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto font-medium text-lg">
                Real feedback from real customers. No fake reviews — just honest opinions.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-panel p-8 rounded-2xl group hover:border-glow transition-all duration-300 hover:-translate-y-1 flex flex-col relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Quote className="w-8 h-8 text-primary/40 mb-4" />
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground font-medium leading-relaxed text-sm flex-1 mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-black text-primary text-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">{t.name}</div>
                      <div className="text-muted-foreground text-xs">{t.role}</div>
                    </div>
                    <div className="ml-auto">
                      <span className="text-[10px] font-bold text-primary/70 uppercase tracking-wider bg-primary/10 px-2 py-1 rounded-full">{t.service}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison Table ── */}
        <section className="py-24 relative z-20 border-y border-white/5 bg-black/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-block px-4 py-1 rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary uppercase tracking-widest mb-4">
                Why Choose Us
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white glow-text mb-4 uppercase tracking-tight">
                ArveX vs The Competition
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
                See why thousands of customers switched to ArveX and never looked back.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto glass-panel rounded-2xl overflow-hidden"
            >
              <div className="grid grid-cols-4 bg-black/40 p-4 border-b border-white/10">
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Feature</div>
                <div className="text-center">
                  <div className="text-sm font-black text-white uppercase tracking-tight">ArveX</div>
                  <div className="text-[10px] text-primary font-bold tracking-wider">YOU ARE HERE</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-muted-foreground uppercase">Competitor A</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-muted-foreground uppercase">Competitor B</div>
                </div>
              </div>
              {COMPARE_FEATURES.map((row, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-4 p-4 border-b border-white/5 last:border-0 transition-colors hover:bg-white/3 ${i % 2 === 0 ? "" : "bg-white/2"}`}
                >
                  <div className="text-sm text-muted-foreground font-medium flex items-center">{row.feature}</div>
                  <div className="flex justify-center items-center">
                    {row.arvex ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 drop-shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                    ) : (
                      <span className="text-red-500/60 font-bold text-lg">✕</span>
                    )}
                  </div>
                  <div className="flex justify-center items-center">
                    {row.competitor1 ? (
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground/50" />
                    ) : (
                      <span className="text-red-500/60 font-bold text-lg">✕</span>
                    )}
                  </div>
                  <div className="flex justify-center items-center">
                    {row.competitor2 ? (
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground/50" />
                    ) : (
                      <span className="text-red-500/60 font-bold text-lg">✕</span>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

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

        {/* ── FAQ ── */}
        <section className="py-28 relative z-20 overflow-hidden border-t border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-block px-4 py-1 rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary uppercase tracking-widest mb-4">
                FAQ
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white glow-text mb-4 uppercase tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto font-medium">
                Everything you need to know before deploying with ArveX.
              </p>
            </motion.div>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className={`w-full glass-panel p-6 rounded-2xl flex items-center justify-between text-left transition-all duration-300 group ${
                      openFaq === i ? "border-glow" : "hover:border-primary/30"
                    }`}
                  >
                    <span className={`font-bold text-sm uppercase tracking-wide transition-colors ${openFaq === i ? "text-primary" : "text-white group-hover:text-primary"}`}>
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-primary shrink-0 ml-4 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="glass-panel mx-2 px-6 py-5 rounded-b-2xl rounded-t-none border-t-0 -mt-2 text-sm text-muted-foreground font-medium leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <p className="text-muted-foreground font-medium mb-4">Still have questions?</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/register">
                  <Button className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Open a Support Ticket
                  </Button>
                </Link>
              </div>
            </motion.div>
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
