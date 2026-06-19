import { useGetPlans } from "@workspace/api-client-react";
import { Navbar, Footer } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Plans({ category, title }: { category: string; title: string }) {
  const { data: plans, isLoading } = useGetPlans({ category });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-20 relative overflow-hidden">
        <div className="absolute inset-0 scanline opacity-10 pointer-events-none z-0" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />

        <div className="container mx-auto px-4 relative z-10">
          <PageTransition>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-5xl md:text-6xl font-black text-white glow-text mb-4 uppercase tracking-tighter">{title}</h1>
              <p className="text-primary font-bold uppercase tracking-widest text-sm mb-4 border-b-2 border-primary/30 inline-block pb-1">Select Your Tier</p>
              <p className="text-muted-foreground text-lg font-medium">
                High-performance infrastructure configured specifically for {category} workloads.
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-end">
                {plans?.map((plan, i) => (
                  <motion.div 
                    key={plan.id} 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className={`glass-panel p-8 rounded-2xl flex flex-col relative transition-all duration-300 hover:-translate-y-2 group ${plan.isFeatured ? 'border-glow shadow-[0_0_40px_rgba(139,0,0,0.3)] bg-card/80 md:-translate-y-4' : 'border-white/10 hover:border-primary/50'}`}
                  >
                    {plan.isFeatured && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border-glow">
                        MOST POPULAR
                      </div>
                    )}
                    
                    <div className="text-xs font-black text-primary/70 mb-1 uppercase tracking-widest">TIER</div>
                    <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">{plan.name}</h3>
                    
                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-5xl font-black text-white group-hover:glow-text transition-all">${plan.price}</span>
                      <span className="text-muted-foreground font-bold tracking-wide uppercase text-sm">/mo</span>
                    </div>

                    {(plan.cpu || plan.ram || plan.storage || plan.bandwidth) && (
                      <div className="space-y-4 mb-8 pb-8 border-b border-white/10">
                        {plan.cpu && <div className="flex justify-between text-sm"><span className="text-muted-foreground font-medium uppercase tracking-wider">CPU</span><span className="text-white font-bold">{plan.cpu}</span></div>}
                        {plan.ram && <div className="flex justify-between text-sm"><span className="text-muted-foreground font-medium uppercase tracking-wider">RAM</span><span className="text-white font-bold">{plan.ram}</span></div>}
                        {plan.storage && <div className="flex justify-between text-sm"><span className="text-muted-foreground font-medium uppercase tracking-wider">Storage</span><span className="text-white font-bold">{plan.storage}</span></div>}
                        {plan.bandwidth && <div className="flex justify-between text-sm"><span className="text-muted-foreground font-medium uppercase tracking-wider">Bandwidth</span><span className="text-white font-bold">{plan.bandwidth}</span></div>}
                      </div>
                    )}

                    <ul className="space-y-4 mb-8 flex-1">
                      {plan.features?.map((feature, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-muted-foreground font-medium">
                          <Check className="w-5 h-5 text-primary shrink-0 drop-shadow-[0_0_8px_rgba(139,0,0,0.8)]" />
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
            )}
          </PageTransition>
        </div>
      </main>
      <Footer />
    </div>
  );
}
