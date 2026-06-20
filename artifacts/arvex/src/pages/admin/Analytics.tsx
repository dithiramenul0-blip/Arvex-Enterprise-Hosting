import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Users, Server, DollarSign, BarChart3, Activity,
  ArrowUpRight, ArrowDownRight, Calendar, Download, RefreshCw,
  Eye, Globe, Zap, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

const REVENUE_DATA = [
  { month: "Jan", revenue: 4200, users: 210, servers: 890 },
  { month: "Feb", revenue: 5800, users: 280, servers: 1100 },
  { month: "Mar", revenue: 7200, users: 350, servers: 1400 },
  { month: "Apr", revenue: 6500, users: 320, servers: 1250 },
  { month: "May", revenue: 9100, users: 430, servers: 1750 },
  { month: "Jun", revenue: 11400, users: 520, servers: 2100 },
  { month: "Jul", revenue: 13200, users: 610, servers: 2450 },
  { month: "Aug", revenue: 12800, users: 590, servers: 2380 },
  { month: "Sep", revenue: 15600, users: 720, servers: 2900 },
  { month: "Oct", revenue: 17200, users: 800, servers: 3200 },
  { month: "Nov", revenue: 19800, users: 920, servers: 3700 },
  { month: "Dec", revenue: 22400, users: 1050, servers: 4200 },
];

const TRAFFIC_SOURCES = [
  { source: "Direct", visits: 4820, pct: 38 },
  { source: "Organic Search", visits: 3210, pct: 25 },
  { source: "Discord", visits: 2560, pct: 20 },
  { source: "Social Media", visits: 1280, pct: 10 },
  { source: "Referral", visits: 890, pct: 7 },
];

const TOP_PLANS = [
  { name: "VPS Starter", orders: 412, revenue: 2060, growth: 12 },
  { name: "Minecraft Basic", orders: 389, revenue: 1167, growth: 8 },
  { name: "Bot Standard", orders: 301, revenue: 903, growth: 22 },
  { name: "VPS Pro", orders: 198, revenue: 1980, growth: 5 },
  { name: "VDS Enterprise", orders: 87, revenue: 1740, growth: 31 },
];

function MiniBarChart({ data, color = "#7c3aed" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-300"
          style={{ height: `${(v / max) * 100}%`, backgroundColor: color, opacity: 0.6 + (i / data.length) * 0.4 }}
        />
      ))}
    </div>
  );
}

export default function AdminAnalytics() {
  const [range, setRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const maxRevenue = Math.max(...REVENUE_DATA.map(d => d.revenue));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">Revenue, users, traffic, and performance metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl overflow-hidden border border-white/10">
            {(["7d", "30d", "90d", "1y"] as const).map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${range === r ? "bg-primary text-white" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}
              >
                {r}
              </button>
            ))}
          </div>
          <Button variant="outline" className="border-white/10 text-muted-foreground hover:text-white">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "$22,400", change: "+18.3%", up: true, icon: DollarSign, color: "text-green-400", sub: "This month" },
          { label: "Active Users", value: "1,247", change: "+12.7%", up: true, icon: Users, color: "text-blue-400", sub: "vs last month" },
          { label: "Active Servers", value: "4,891", change: "+9.2%", up: true, icon: Server, color: "text-primary", sub: "All services" },
          { label: "Churn Rate", value: "2.1%", change: "-0.4%", up: false, icon: TrendingUp, color: "text-yellow-400", sub: "Monthly avg" },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-panel p-6 rounded-2xl relative overflow-hidden group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${kpi.up ? "text-green-400" : "text-red-400"}`}>
                  {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change}
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1">{kpi.value}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{kpi.label}</div>
              <div className="text-[11px] text-muted-foreground/60 mt-1">{kpi.sub}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-8 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Revenue Overview</h3>
            <p className="text-muted-foreground text-sm font-medium mt-1">Monthly revenue trend for 2025</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" />Revenue</div>
          </div>
        </div>
        <div className="flex items-end gap-2 h-48">
          {REVENUE_DATA.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div
                className="w-full rounded-t-lg bg-primary/20 border-t-2 border-primary relative overflow-hidden transition-all duration-300 group-hover:bg-primary/40 cursor-pointer"
                style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-transparent" />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded hidden group-hover:block whitespace-nowrap">
                  ${d.revenue.toLocaleString()}
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">{d.month}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-8 rounded-2xl"
        >
          <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6">Traffic Sources</h3>
          <div className="space-y-4">
            {TRAFFIC_SOURCES.map((t, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary/60" />
                    <span className="text-white font-medium">{t.source}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-xs">{t.visits.toLocaleString()} visits</span>
                    <span className="text-primary font-bold text-xs w-8 text-right">{t.pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${t.pct}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-violet-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-8 rounded-2xl"
        >
          <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6">Top Plans by Revenue</h3>
          <div className="space-y-3">
            {TOP_PLANS.map((plan, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary font-black text-sm">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-sm truncate">{plan.name}</div>
                  <div className="text-muted-foreground text-xs">{plan.orders} orders</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-sm">${plan.revenue.toLocaleString()}</div>
                  <div className="text-green-400 text-xs font-bold">+{plan.growth}%</div>
                </div>
                <MiniBarChart data={[20, 35, 28, 45, plan.growth * 2, 50, 60]} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Server monitoring */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-panel p-8 rounded-2xl"
      >
        <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6">Resource Usage</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "CPU Usage", value: 42, color: "from-blue-500 to-cyan-400", icon: Activity },
            { label: "RAM Usage", value: 67, color: "from-violet-500 to-primary", icon: Zap },
            { label: "Disk I/O", value: 31, color: "from-green-500 to-emerald-400", icon: Server },
            { label: "Network", value: 58, color: "from-orange-500 to-amber-400", icon: Globe },
          ].map((res, i) => {
            const Icon = res.icon;
            return (
              <div key={i} className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <motion.circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke="url(#grad)" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - res.value / 100) }}
                      transition={{ delay: 0.7 + i * 0.1, duration: 0.8 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-black text-white">{res.value}%</span>
                  </div>
                </div>
                <Icon className="w-4 h-4 text-primary/60 mx-auto mb-1" />
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{res.label}</div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
