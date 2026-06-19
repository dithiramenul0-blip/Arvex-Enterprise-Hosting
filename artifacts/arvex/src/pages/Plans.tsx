import { useGetPlans } from "@workspace/api-client-react";
import { Navbar, Footer } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "wouter";

export default function Plans({ category, title }: { category: string; title: string }) {
  const { data: plans, isLoading } = useGetPlans({ category });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <PageTransition>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white glow-text mb-4">{title}</h1>
              <p className="text-muted-foreground text-lg">
                High-performance infrastructure configured specifically for {category} workloads.
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans?.map((plan) => (
                  <div 
                    key={plan.id} 
                    className={`glass-panel p-8 rounded-2xl flex flex-col relative ${plan.isFeatured ? 'border-primary shadow-[0_0_30px_rgba(139,0,0,0.2)] transform md:-translate-y-4' : 'border-white/10'}`}
                  >
                    {plan.isFeatured && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">
                        MOST POPULAR
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-4xl font-bold text-white">${plan.price}</span>
                      <span className="text-muted-foreground">/mo</span>
                    </div>

                    {(plan.cpu || plan.ram || plan.storage || plan.bandwidth) && (
                      <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                        {plan.cpu && <div className="flex justify-between text-sm"><span className="text-muted-foreground">CPU</span><span className="text-white font-medium">{plan.cpu}</span></div>}
                        {plan.ram && <div className="flex justify-between text-sm"><span className="text-muted-foreground">RAM</span><span className="text-white font-medium">{plan.ram}</span></div>}
                        {plan.storage && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Storage</span><span className="text-white font-medium">{plan.storage}</span></div>}
                        {plan.bandwidth && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Bandwidth</span><span className="text-white font-medium">{plan.bandwidth}</span></div>}
                      </div>
                    )}

                    <ul className="space-y-4 mb-8 flex-1">
                      {plan.features?.map((feature, i) => (
                        <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                          <Check className="w-5 h-5 text-primary shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={`/client/orders/new?plan=${plan.id}`}>
                      <Button className={`w-full h-12 ${plan.isFeatured ? 'bg-primary hover:bg-primary/90 text-white' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
                        Order Now
                      </Button>
                    </Link>
                  </div>
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
