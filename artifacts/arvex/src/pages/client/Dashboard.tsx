import { useGetServices, useGetOrders, useGetTickets } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  Server, ShoppingCart, Ticket, Activity, ArrowRight, Plus, ExternalLink,
  CheckCircle2, Clock, AlertCircle, Zap, Shield, Headset, Globe,
  ArrowUpRight, TrendingUp, BarChart3, CreditCard, ChevronRight,
  RefreshCw, HardDrive, Cpu, Network, Star, MessageSquare, FileText
} from "lucide-react";

const QUICK_ACTIONS = [
  { label: "New Ticket", icon: Headset, href: "/client/tickets/new", color: "from-violet-500/20 to-primary/10", border: "border-primary/20", text: "text-primary", desc: "Get expert help" },
  { label: "Deploy Server", icon: Zap, href: "/vps", color: "from-blue-500/20 to-cyan-500/10", border: "border-blue-500/20", text: "text-blue-400", desc: "Start new service" },
  { label: "View Plans", icon: TrendingUp, href: "/vps", color: "from-green-500/20 to-emerald-500/10", border: "border-green-500/20", text: "text-green-400", desc: "Upgrade & scale" },
  { label: "Documentation", icon: FileText, href: "/client/downloads", color: "from-orange-500/20 to-amber-500/10", border: "border-orange-500/20", text: "text-orange-400", desc: "Guides & tutorials" },
];

const NETWORK_REGIONS = [
  { region: "North America", nodes: 102, ping: "~3ms", status: "online" },
  { region: "Europe", nodes: 154, ping: "~9ms", status: "online" },
  { region: "Asia Pacific", nodes: 96, ping: "~16ms", status: "online" },
  { region: "South America", nodes: 18, ping: "~12ms", status: "online" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

export default function ClientDashboard() {
  const { user } = useAuth();
  const { data: services, isLoading: servicesLoading } = useGetServices();
  const { data: orders } = useGetOrders();
  const { data: tickets } = useGetTickets();

  const activeServices = services?.filter(s => s.status === 'active') || [];
  const openTickets = tickets?.filter(t => t.status !== 'closed') || [];
  const recentOrders = orders?.slice(0, 5) || [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const statCards = [
    {
      label: "Active Services", value: activeServices.length, icon: Server,
      color: "text-primary", bg: "bg-primary/10", border: "border-primary/20",
      href: "/client/services", suffix: "running",
    },
    {
      label: "Total Orders", value: orders?.length || 0, icon: ShoppingCart,
      color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20",
      href: "/client/orders", suffix: "placed",
    },
    {
      label: "Open Tickets", value: openTickets.length, icon: Ticket,
      color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20",
      href: "/client/tickets", suffix: "pending",
    },
    {
      label: "Network Uptime", value: "99.99%", icon: Activity,
      color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20",
      href: "/client", suffix: "SLA",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">

      {/* ── Welcome Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-violet-600/5 to-transparent p-6 md:p-8"
      >
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute right-12 bottom-0 w-32 h-32 bg-violet-500/10 rounded-full blur-[40px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[11px] font-bold text-green-400 uppercase tracking-widest">All Systems Online</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white mb-1">
              {greeting}, <span className="text-primary glow-text">{user?.firstName}</span> 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              You have <span className="text-white font-bold">{activeServices.length} active service{activeServices.length !== 1 ? "s" : ""}</span>
              {openTickets.length > 0 && <> and <span className="text-orange-400 font-bold">{openTickets.length} open ticket{openTickets.length !== 1 ? "s" : ""}</span></>}.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/client/tickets/new">
              <Button size="sm" variant="outline" className="border-white/10 text-muted-foreground hover:text-white hover:border-primary/40 text-xs font-bold uppercase tracking-wide">
                <Headset className="w-3.5 h-3.5 mr-1.5" /> Support
              </Button>
            </Link>
            <Link href="/vps">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(124,58,237,0.4)]">
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Deploy Service
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} custom={i} initial="hidden" animate="visible" variants={cardVariants}>
              <Link href={card.href}>
                <div className={`relative overflow-hidden rounded-2xl border ${card.border} bg-black/40 backdrop-blur p-5 hover:bg-white/3 transition-all group cursor-pointer`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center`}>
                      <Icon className={`w-4.5 h-4.5 ${card.color}`} />
                    </div>
                    <ArrowUpRight className={`w-3.5 h-3.5 ${card.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </div>
                  <div className={`text-2xl font-black ${card.color} mb-0.5`}>{card.value}</div>
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{card.label}</div>
                  <div className="text-[10px] text-muted-foreground/50 uppercase tracking-widest mt-0.5">{card.suffix}</div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* ── Quick Actions ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-xs font-black text-muted-foreground/40 uppercase tracking-widest mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}>
                <div className={`rounded-xl border ${action.border} bg-gradient-to-br ${action.color} p-4 hover:scale-[1.02] transition-all cursor-pointer group`}>
                  <Icon className={`w-5 h-5 ${action.text} mb-2`} />
                  <div className={`text-sm font-black ${action.text} uppercase tracking-wide`}>{action.label}</div>
                  <div className="text-[10px] text-muted-foreground/60 mt-0.5">{action.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Active Services */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="xl:col-span-2 rounded-2xl border border-white/8 bg-black/40 overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-black text-white uppercase tracking-wide">Active Services</h2>
              {activeServices.length > 0 && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">{activeServices.length}</span>
              )}
            </div>
            <Link href="/client/services">
              <Button variant="ghost" size="sm" className="text-[10px] text-primary hover:text-white hover:bg-primary/20 font-bold uppercase tracking-wider h-7 px-2">
                View All <ChevronRight className="w-3 h-3 ml-0.5" />
              </Button>
            </Link>
          </div>
          <div className="p-5">
            {servicesLoading ? (
              <div className="space-y-3">
                {[1, 2].map(i => <div key={i} className="h-16 rounded-xl bg-white/3 animate-pulse" />)}
              </div>
            ) : activeServices.length > 0 ? (
              <div className="space-y-3">
                {activeServices.slice(0, 5).map(service => (
                  <div key={service.id} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Server className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{service.planName || 'Service'}</div>
                        <div className="text-[11px] text-muted-foreground font-medium">{service.serverIp || 'Provisioning...'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Active</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Server className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">No active services yet</p>
                <Link href="/vps">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-widest">
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Deploy First Server
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Sidebar Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* Network Status */}
          <div className="rounded-2xl border border-white/8 bg-black/40 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
              <Network className="w-4 h-4 text-green-400" />
              <h2 className="text-sm font-black text-white uppercase tracking-wide">Network Status</h2>
            </div>
            <div className="p-4 space-y-2.5">
              {NETWORK_REGIONS.map(r => (
                <div key={r.region} className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">{r.region}</div>
                    <div className="text-[10px] text-muted-foreground">{r.nodes} nodes · {r.ping}</div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[9px] font-bold text-green-400 uppercase">Online</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="rounded-2xl border border-white/8 bg-black/40 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-orange-400" />
                <h2 className="text-sm font-black text-white uppercase tracking-wide">Tickets</h2>
              </div>
              <Link href="/client/tickets">
                <Button variant="ghost" size="sm" className="text-[10px] text-orange-400 hover:text-white font-bold h-6 px-2">
                  View All
                </Button>
              </Link>
            </div>
            <div className="p-3 space-y-2">
              {tickets && tickets.length > 0 ? tickets.slice(0, 4).map(ticket => (
                <div key={ticket.id} className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-white/3 transition-colors">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${ticket.status === 'open' ? 'bg-primary' : ticket.status === 'in_progress' ? 'bg-yellow-400' : 'bg-muted-foreground/30'}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">{ticket.subject}</div>
                    <div className="text-[10px] text-muted-foreground capitalize">{ticket.status.replace('_', ' ')}</div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-6">
                  <p className="text-xs text-muted-foreground">No tickets</p>
                  <Link href="/client/tickets/new">
                    <Button size="sm" variant="outline" className="mt-2 h-7 text-[10px] border-white/10">
                      Open Ticket
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Recent Orders ── */}
      {recentOrders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-2xl border border-white/8 bg-black/40 overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-black text-white uppercase tracking-wide">Recent Orders</h2>
            </div>
            <Link href="/client/orders">
              <Button variant="ghost" size="sm" className="text-[10px] text-blue-400 hover:text-white font-bold h-6 px-2">
                View All
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/2 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-400/10 border border-blue-400/20 flex items-center justify-center">
                    <ShoppingCart className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Order #{order.id}</div>
                    <div className="text-[10px] text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {order.totalPrice && (
                    <div className="text-sm font-black text-white">${parseFloat(String(order.totalPrice)).toFixed(2)}</div>
                  )}
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                    order.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                    'bg-white/10 text-muted-foreground'
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Getting Started (for new users) ── */}
      {activeServices.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-primary/10">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-black text-white uppercase tracking-wide">Get Started</h2>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { step: "1", title: "Choose a Plan", desc: "Browse our hosting plans and pick what fits your needs.", href: "/vps", cta: "View Plans", icon: BarChart3 },
                { step: "2", title: "Deploy in Seconds", desc: "Your server goes live in under 60 seconds after payment.", href: "/vps", cta: "Deploy Now", icon: Zap },
                { step: "3", title: "Get Support", desc: "Our team is online 24/7. Open a ticket anytime.", href: "/client/tickets/new", cta: "Contact Us", icon: Headset },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="p-4 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-sm">{item.step}</div>
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-black text-white mb-1">{item.title}</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">{item.desc}</p>
                    <Link href={item.href}>
                      <Button size="sm" variant="outline" className="h-7 text-[10px] border-primary/30 text-primary hover:bg-primary/10 font-bold uppercase tracking-wider">
                        {item.cta} <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
