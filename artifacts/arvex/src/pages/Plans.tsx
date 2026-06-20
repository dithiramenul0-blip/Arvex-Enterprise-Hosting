import { useGetPlans } from "@workspace/api-client-react";
import { Navbar, Footer } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import {
  Check, Shield, Zap, Server, Globe, Cpu, Bot, HardDrive, Wifi,
  Lock, Clock, Headset, Database, RefreshCw, Network, Eye,
  CloudLightning, Terminal, Gauge, GitBranch, Layers, BarChart3,
  ArrowRight, Star, CheckCircle2
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const CATEGORY_IMAGES: Record<string, string> = {
  vps: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80",
  minecraft: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1920&q=80",
  bot: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1920&q=80",
  vds: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1920&q=80",
  web: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1920&q=80",
  v2ray: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
};

const CATEGORY_DESCS: Record<string, string> = {
  vps: "Full root-access virtual private servers on dedicated NVMe hardware.",
  minecraft: "Ultra-low latency game servers with mod support, auto-backups, and DDoS protection.",
  bot: "24/7 uptime hosting for Discord bots, automation scripts, and Node.js apps.",
  vds: "Virtual dedicated servers with guaranteed CPU cores and isolated resources.",
  web: "cPanel web hosting with 1-click WordPress, unlimited subdomains, and SSL.",
  v2ray: "Enterprise VMess, VLess, Shadowsocks, and Trojan proxy infrastructure.",
};

const CATEGORY_FEATURES: Record<string, { category: string; icon: React.ElementType; items: string[] }[]> = {
  vps: [
    {
      category: "Performance",
      icon: Zap,
      items: [
        "Pure NVMe SSD storage arrays",
        "AMD EPYC / Intel Xeon processors",
        "DDR5 ECC RAM",
        "10 Gbps dedicated uplink",
        "KVM virtualization (full isolation)",
        "Low-latency anycast routing",
        "CPU boost / burst support",
        "NUMA-optimized memory allocation",
        "Zero contention resource guarantee",
        "Hardware-level I/O isolation",
      ]
    },
    {
      category: "Security",
      icon: Shield,
      items: [
        "10 Tbps DDoS mitigation (always-on)",
        "Layer 3/4/7 attack filtering",
        "Null routing for volumetric attacks",
        "Private IPv4 + IPv6 addresses",
        "Firewall management panel",
        "SSH key authentication support",
        "Fail2ban pre-installed",
        "Two-factor authentication (2FA)",
        "Encrypted QEMU-img disk images",
        "Isolated network namespace",
      ]
    },
    {
      category: "Access & Control",
      icon: Terminal,
      items: [
        "Full root access via SSH",
        "VNC / IPMI console access",
        "Custom ISO upload support",
        "OS reinstall in 1 click",
        "Reboot / shutdown from panel",
        "Rescue mode / recovery console",
        "rDNS (reverse DNS) configuration",
        "Mount additional drives",
        "IPv6 /64 block included",
        "GRUB bootloader access",
      ]
    },
    {
      category: "Operating Systems",
      icon: Layers,
      items: [
        "Ubuntu 20.04 / 22.04 / 24.04",
        "Debian 11 / 12",
        "CentOS Stream 9",
        "Rocky Linux 8/9",
        "AlmaLinux 8/9",
        "Fedora Server 38/39",
        "Windows Server 2019/2022",
        "FreeBSD 13/14",
        "OpenBSD 7.x",
        "Custom ISO upload",
      ]
    },
    {
      category: "Backups & Recovery",
      icon: RefreshCw,
      items: [
        "Daily automated snapshots",
        "Point-in-time restore",
        "Off-site backup replication",
        "7-day backup retention",
        "Manual on-demand snapshots",
        "Snapshot export (download)",
        "Clone/duplicate server",
        "Backup encryption at rest",
        "Cross-datacenter backup mirror",
        "Restore to different node",
      ]
    },
    {
      category: "Monitoring & Support",
      icon: Eye,
      items: [
        "Real-time CPU/RAM/Disk graphs",
        "Network traffic monitoring",
        "Uptime & ping monitoring",
        "Email/Discord downtime alerts",
        "24/7 expert human support",
        "Under 5-minute response time",
        "Live chat + ticket system",
        "Dedicated onboarding call (Pro+)",
        "SLA 99.99% uptime guarantee",
        "Status page at status.arvex.host",
      ]
    },
  ],
  minecraft: [
    {
      category: "Performance",
      icon: Zap,
      items: [
        "Dedicated Minecraft-tuned JVM",
        "NVMe SSD world storage",
        "Low-latency game network",
        "High clock-speed CPUs (5GHz+)",
        "Ryzen 9 / i9 processors",
        "Pre-optimized server JARs",
        "Aikar's JVM flags pre-configured",
        "World pre-generation support",
        "Chunk loading optimization",
        "Entity tick rate tuning",
      ]
    },
    {
      category: "Server Software",
      icon: CloudLightning,
      items: [
        "Vanilla Minecraft (all versions)",
        "Paper / Purpur / Folia support",
        "Spigot / Bukkit / CraftBukkit",
        "Fabric + Quilt loader",
        "Forge modloader",
        "NeoForge support",
        "BungeeCord / Waterfall proxy",
        "Velocity proxy",
        "Bedrock (Geyser/Floodgate)",
        "Modpack installer (CurseForge/Modrinth)",
      ]
    },
    {
      category: "Management Panel",
      icon: Layers,
      items: [
        "Pterodactyl game panel",
        "File manager (drag & drop)",
        "Console with live RCON",
        "Scheduled tasks (cron)",
        "Player management commands",
        "Automated restart scheduler",
        "Startup parameter editor",
        "Server properties editor",
        "Sub-user access control",
        "API access for automation",
      ]
    },
    {
      category: "Mod & Plugin Support",
      icon: GitBranch,
      items: [
        "1-click mod installer",
        "Plugin upload via SFTP",
        "Mod dependency resolver",
        "Version switcher (Java 8-21)",
        "Forge mod compatibility checks",
        "Shaderpack / resource pack hosting",
        "Custom world seed support",
        "Dynmap / Bluemap hosting",
        "Plugin marketplace integration",
        "Backup before mod installs",
      ]
    },
    {
      category: "Security & DDoS",
      icon: Shield,
      items: [
        "10 Tbps DDoS protection",
        "Game-protocol filter (Minecraft aware)",
        "IP whitelist / blacklist",
        "Anti-bot join protection",
        "BotFilter / LimboFilter compatible",
        "Proxy hide (real IP hidden)",
        "Rate-limit connection throttling",
        "Firewall rule management",
        "Player IP logging",
        "GeoIP blocking support",
      ]
    },
    {
      category: "Backups & Support",
      icon: RefreshCw,
      items: [
        "Automated daily world backups",
        "Off-server backup storage",
        "One-click world restore",
        "Download backups locally",
        "Backup scheduling (custom interval)",
        "24/7 Minecraft expert support",
        "Community Discord server",
        "Video setup guides",
        "Migrate from other hosts (free)",
        "99.99% uptime SLA",
      ]
    },
  ],
  bot: [
    {
      category: "Runtime & Languages",
      icon: Terminal,
      items: [
        "Node.js 16 / 18 / 20 / 22 LTS",
        "Python 3.9 / 3.10 / 3.11 / 3.12",
        "Java 17 / 21 (JDA / Javacord)",
        "Go 1.21+",
        "Ruby 3.x",
        "PHP 8.x",
        "Rust (via custom Docker)",
        "Bun runtime support",
        "Deno runtime support",
        ".NET 8 / ASP.NET Core",
      ]
    },
    {
      category: "Process Management",
      icon: RefreshCw,
      items: [
        "PM2 / nodemon process manager",
        "Auto-restart on crash",
        "Startup on boot (always-on)",
        "Scheduled restarts",
        "Multi-process per account",
        "Resource limits per process",
        "Process isolation (no shared memory)",
        "Environment variable management",
        "Secrets vault for tokens",
        "Process priority tuning",
      ]
    },
    {
      category: "Bot Frameworks",
      icon: Bot,
      items: [
        "Discord.js v14 support",
        "Discord.py / Hikari / Nextcord",
        "discord4j / JDA (Java)",
        "Serenity (Rust) support",
        "Telegram Bot API",
        "Slack Bot SDK",
        "WhatsApp (Baileys) support",
        "Revolt.chat bots",
        "Guilded bot hosting",
        "Custom webhook receivers",
      ]
    },
    {
      category: "Storage & Databases",
      icon: Database,
      items: [
        "Persistent file storage",
        "SQLite database (local)",
        "MySQL / MariaDB (add-on)",
        "PostgreSQL (add-on)",
        "Redis cache (add-on)",
        "MongoDB (add-on)",
        "S3-compatible object storage",
        "NVMe-backed I/O",
        "Automatic disk expansion",
        "Data backup & export",
      ]
    },
    {
      category: "Networking",
      icon: Network,
      items: [
        "Outbound HTTP/HTTPS",
        "WebSocket client support",
        "Static IPv4 (optional)",
        "Custom domain binding",
        "Port forwarding (HTTP)",
        "SSL/TLS certificates",
        "Rate-limited outbound protection",
        "Proxy/VPN support for requests",
        "Low-latency Discord gateway",
        "Global Cloudflare network relay",
      ]
    },
    {
      category: "Monitoring & Support",
      icon: Eye,
      items: [
        "Real-time log streaming",
        "CPU / RAM usage graphs",
        "Uptime monitoring",
        "Crash alerts via Discord webhook",
        "Email downtime notifications",
        "Log history (7 days)",
        "24/7 human support",
        "Discord developer community",
        "Bot migration assistance",
        "99.9% uptime guarantee",
      ]
    },
  ],
  vds: [
    {
      category: "Dedicated Resources",
      icon: Cpu,
      items: [
        "Guaranteed CPU cores (no sharing)",
        "Dedicated DDR5 ECC RAM",
        "NVMe SSD dedicated storage",
        "10 Gbps dedicated bandwidth port",
        "No noisy neighbor effect",
        "Hardware-pinned CPU threads",
        "NUMA node isolation",
        "PCIe passthrough support",
        "GPU add-on available",
        "Custom hardware configs on request",
      ]
    },
    {
      category: "Virtualization",
      icon: Layers,
      items: [
        "Proxmox VE hypervisor",
        "KVM full virtualization",
        "LXC container option",
        "Nested virtualization support",
        "Live migration (zero downtime)",
        "Snapshot & clone support",
        "Custom CPU model (host passthrough)",
        "BIOS / UEFI boot selection",
        "TPM 2.0 virtual chip",
        "Secure Boot support",
      ]
    },
    {
      category: "Performance",
      icon: Gauge,
      items: [
        "AMD EPYC Gen 4 processors",
        "Intel Xeon Scalable (3rd gen+)",
        "NVMe RAID-10 storage backend",
        "10 Gbps uplink per node",
        "Sub-millisecond disk I/O",
        "Unmetered DDoS mitigation",
        "Anycast routing",
        "IPv4 + IPv6 dual-stack",
        "BGP session available (Enterprise)",
        "/29 IPv4 block available",
      ]
    },
    {
      category: "Operating Systems",
      icon: Terminal,
      items: [
        "Ubuntu Server 22.04 / 24.04",
        "Debian 12 Bookworm",
        "Rocky Linux 9",
        "AlmaLinux 9",
        "Windows Server 2019/2022",
        "Windows Server 2025",
        "Proxmox VE (bare metal style)",
        "TrueNAS SCALE",
        "Custom ISO upload",
        "Bring-your-own license (BYOL)",
      ]
    },
    {
      category: "Control & Access",
      icon: Eye,
      items: [
        "Proxmox web UI access",
        "VNC / SPICE console",
        "IPMI-grade out-of-band access",
        "Full root/administrator access",
        "Remote power cycle",
        "Boot order configuration",
        "Network interface management",
        "Disk hot-attach / detach",
        "Resource scaling without reboot",
        "API-driven management",
      ]
    },
    {
      category: "Backups & SLA",
      icon: RefreshCw,
      items: [
        "Daily automated snapshots",
        "Offsite backup replication",
        "Manual on-demand backup",
        "14-day backup retention",
        "Full disk image export",
        "Clone to new VDS",
        "SLA 99.99% uptime",
        "24/7 enterprise support",
        "Dedicated account manager (Enterprise)",
        "Response time < 5 minutes",
      ]
    },
  ],
  web: [
    {
      category: "Hosting Features",
      icon: Globe,
      items: [
        "cPanel control panel",
        "1-click WordPress installer",
        "1-click Joomla / Drupal / PrestaShop",
        "Unlimited subdomains",
        "Unlimited email accounts",
        "Unlimited MySQL databases",
        "Unlimited FTP accounts",
        "PHP 7.4 / 8.0 / 8.1 / 8.2 / 8.3",
        "Node.js application support",
        "Python / Ruby app hosting",
      ]
    },
    {
      category: "Performance",
      icon: Zap,
      items: [
        "LiteSpeed Enterprise web server",
        "LSCache WordPress plugin",
        "NVMe SSD storage",
        "CloudLinux OS (resource isolation)",
        "GZIP / Brotli compression",
        "HTTP/2 & HTTP/3 support",
        "Cloudflare CDN integration",
        "Redis object cache",
        "Memcached support",
        "OPcache (PHP bytecode cache)",
      ]
    },
    {
      category: "Security",
      icon: Shield,
      items: [
        "Free Let's Encrypt SSL (auto-renew)",
        "Wildcard SSL certificates",
        "ModSecurity WAF",
        "Imunify360 malware scanner",
        "Brute-force login protection",
        "DDoS protection layer",
        "Daily malware scans",
        "Two-factor authentication",
        "Firewall with custom rules",
        "Hotlink protection",
      ]
    },
    {
      category: "Email",
      icon: Network,
      items: [
        "Webmail (Roundcube / Horde)",
        "IMAP / POP3 / SMTP",
        "SpamAssassin spam filtering",
        "Email forwarding & aliases",
        "Mailing list support",
        "DKIM / SPF / DMARC",
        "Custom MX records",
        "Email encryption (TLS)",
        "Catch-all email address",
        "Boxtrapper spam protection",
      ]
    },
    {
      category: "Developer Tools",
      icon: Terminal,
      items: [
        "SSH access (select plans)",
        "Git version control (cPanel)",
        "WP-CLI support",
        "Composer (PHP)",
        "npm / Yarn (Node.js)",
        "Cron job scheduler",
        "Custom error pages",
        "Redirect manager",
        ".htaccess editor",
        "Staging environment (Pro+)",
      ]
    },
    {
      category: "Backups & Support",
      icon: RefreshCw,
      items: [
        "Daily automated backups",
        "Weekly backup retention (30 days)",
        "One-click restore from backup",
        "Manual full-account backup download",
        "JetBackup integration",
        "Off-site backup storage",
        "Free website migration",
        "24/7 hosting expert support",
        "WordPress support included",
        "99.9% uptime SLA",
      ]
    },
  ],
  v2ray: [
    {
      category: "Protocols",
      icon: Wifi,
      items: [
        "VMess (V2Ray core)",
        "VLess (XTLS / XRAY)",
        "Shadowsocks 2022",
        "Shadowsocks-libev",
        "Trojan / Trojan-GFW",
        "Trojan-Go",
        "SOCKS5 proxy",
        "HTTP/HTTPS proxy",
        "Hysteria2 protocol",
        "TUIC v5 protocol",
      ]
    },
    {
      category: "Transport Layers",
      icon: Network,
      items: [
        "WebSocket (WS) transport",
        "gRPC transport",
        "TCP transport",
        "mKCP transport",
        "QUIC transport",
        "HTTP/2 (H2) transport",
        "HTTPUpgrade transport",
        "SplitHTTP transport",
        "MEEK-lite (optional)",
        "Custom transport headers",
      ]
    },
    {
      category: "TLS & Encryption",
      icon: Lock,
      items: [
        "TLS 1.2 / TLS 1.3",
        "XTLS Vision flow",
        "XTLS RPRX-Direct",
        "REALITY protocol",
        "uTLS fingerprint spoofing",
        "Custom SNI configuration",
        "Certificate auto-management",
        "ACME / Let's Encrypt TLS",
        "Custom TLS pinning",
        "ECH (Encrypted Client Hello)",
      ]
    },
    {
      category: "Performance",
      icon: Gauge,
      items: [
        "10 Gbps network uplinks",
        "Low-latency anycast routing",
        "Unlimited data transfer",
        "Multi-threaded core engine",
        "Connection multiplexing (Mux)",
        "Xray-core (latest builds)",
        "Sing-box compatibility",
        "Kernel-level TCP tuning",
        "BBR congestion control",
        "Zero packet loss routing",
      ]
    },
    {
      category: "Management",
      icon: Terminal,
      items: [
        "X-UI / 3X-UI panel support",
        "Marzban panel support",
        "Hiddify panel support",
        "API-based user management",
        "Traffic quota per user",
        "Expiry date per account",
        "QR code config generation",
        "Subscription link (sub URL)",
        "Clash / Sing-box config export",
        "Multi-user on single port",
      ]
    },
    {
      category: "Security & Locations",
      icon: Shield,
      items: [
        "10 Tbps DDoS protection",
        "IP whitelisting / blacklisting",
        "GeoIP routing rules",
        "Traffic obfuscation",
        "Deep packet inspection bypass",
        "No-log policy",
        "Nodes in 12+ countries",
        "Residential IP option (Enterprise)",
        "Dedicated IP per account",
        "Automatic failover routing",
      ]
    },
  ],
};

export default function Plans({ category, title }: { category: string; title: string }) {
  const { data: plans, isLoading } = useGetPlans({ category });
  const heroImage = CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES.vps;
  const categoryFeatures = CATEGORY_FEATURES[category] ?? CATEGORY_FEATURES.vps;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ── Hero Banner ── */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={heroImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-primary/15 mix-blend-multiply" />
        <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 mb-4 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-bold tracking-widest text-primary uppercase">Select Your Tier</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white glow-text uppercase tracking-tighter leading-none">
              {title}
            </h1>
            <p className="text-white/70 text-lg font-medium mt-3 max-w-xl">
              {CATEGORY_DESCS[category] ?? `High-performance ${category} infrastructure.`}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Plans Grid ── */}
      <main className="flex-1 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-violet-700/10 rounded-full blur-[100px] pointer-events-none z-0" />

        <div className="container mx-auto px-4 relative z-10">
          {isLoading ? (
            <div className="flex justify-center py-32">
              <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <PageTransition>
              <div className={`grid grid-cols-1 md:grid-cols-${Math.min(plans?.length ?? 3, 3)} gap-8 max-w-6xl mx-auto items-end`}>
                {plans?.map((plan, i) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className={`glass-panel p-8 rounded-2xl flex flex-col relative transition-all duration-300 hover:-translate-y-2 group ${plan.isFeatured ? 'border-glow shadow-[0_0_50px_rgba(124,58,237,0.25)] bg-card/80 md:-translate-y-4' : 'border-white/10 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)]'}`}
                  >
                    {plan.isFeatured && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border-glow shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                        MOST POPULAR
                      </div>
                    )}

                    {plan.imageUrl && (
                      <div className="h-28 -mx-8 -mt-8 mb-8 rounded-t-2xl overflow-hidden relative">
                        <img src={plan.imageUrl} alt={plan.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/80" />
                      </div>
                    )}

                    <div className="text-xs font-black text-primary/70 mb-1 uppercase tracking-widest">TIER</div>
                    <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">{plan.name}</h3>

                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-5xl font-black text-white group-hover:text-primary transition-all">${plan.price}</span>
                      <span className="text-muted-foreground font-bold tracking-wide uppercase text-sm">/mo</span>
                    </div>

                    {(plan.cpu || plan.ram || plan.storage || plan.bandwidth) && (
                      <div className="space-y-3 mb-8 pb-8 border-b border-white/10">
                        {plan.cpu && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground font-medium uppercase tracking-wider">CPU</span>
                            <span className="text-white font-bold">{plan.cpu}</span>
                          </div>
                        )}
                        {plan.ram && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground font-medium uppercase tracking-wider">RAM</span>
                            <span className="text-white font-bold">{plan.ram}</span>
                          </div>
                        )}
                        {plan.storage && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground font-medium uppercase tracking-wider">Storage</span>
                            <span className="text-white font-bold">{plan.storage}</span>
                          </div>
                        )}
                        {plan.bandwidth && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground font-medium uppercase tracking-wider">Bandwidth</span>
                            <span className="text-white font-bold">{plan.bandwidth}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features?.map((feature, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-muted-foreground font-medium">
                          <Check className="w-5 h-5 text-primary shrink-0 drop-shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={`/client/orders/new?plan=${plan.id}`}>
                      <Button className={`w-full h-14 font-black uppercase tracking-widest text-sm transition-all ${plan.isFeatured ? 'btn-glow bg-primary hover:bg-primary/90 text-white hover:scale-[1.02]' : 'bg-white/5 hover:bg-primary/20 text-white border border-white/10 hover:border-primary/50'}`}>
                        Order Now <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </PageTransition>
          )}
        </div>
      </main>

      {/* ── All Included Features ── */}
      <section className="py-24 relative z-20 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-1 rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary uppercase tracking-widest mb-4">
              Everything Included
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white glow-text mb-4 uppercase tracking-tight">
              400+ Features on Every Plan
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-medium text-lg">
              No hidden extras. Every feature listed below is included in your plan from day one.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {categoryFeatures.map((group, gi) => {
              const Icon = group.icon;
              return (
                <motion.div
                  key={gi}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: gi * 0.07 }}
                  className="glass-panel p-8 rounded-2xl relative overflow-hidden group hover:border-glow transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{group.category}</h3>
                  </div>
                  <ul className="space-y-3">
                    {group.items.map((item, ii) => (
                      <li key={ii} className="flex items-start gap-3 text-sm text-muted-foreground font-medium">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5 drop-shadow-[0_0_6px_rgba(124,58,237,0.6)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <div className="inline-flex flex-wrap justify-center gap-6 glass-panel px-8 py-6 rounded-2xl max-w-4xl mx-auto">
              {[
                { icon: Shield, label: "10 Tbps DDoS Protection" },
                { icon: Gauge, label: "99.99% Uptime SLA" },
                { icon: Clock, label: "24/7 Human Support" },
                { icon: Zap, label: "NVMe SSD Storage" },
                { icon: RefreshCw, label: "Daily Backups" },
                { icon: Star, label: "No Setup Fees" },
              ].map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                    <Icon className="w-4 h-4 text-primary" />
                    <span>{b.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
