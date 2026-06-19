import { useGetPlans } from "@workspace/api-client-react";
import { Navbar, Footer } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Check, Wifi } from "lucide-react";
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

export default function Plans({ category, title }: { category: string; title: string }) {
  const { data: plans, isLoading } = useGetPlans({ category });
  const heroImage = CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES.vps;

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
                        Order Now
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </PageTransition>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
