import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Search, Download, Globe, Monitor, Smartphone, LogIn, LogOut, Settings, DollarSign, Ticket, Server } from "lucide-react";
import { ClientLayout } from "@/components/ClientLayout";

interface Activity {
  id: number;
  action: string;
  category: string;
  ip: string;
  location: string;
  device: string;
  browser: string;
  timestamp: string;
  success: boolean;
}

const ACTIVITIES: Activity[] = [
  { id: 1, action: "Login", category: "auth", ip: "185.234.21.10", location: "Frankfurt, DE", device: "Desktop", browser: "Chrome 124", timestamp: "2025-06-20 14:32", success: true },
  { id: 2, action: "Invoice #1047 Paid", category: "billing", ip: "185.234.21.10", location: "Frankfurt, DE", device: "Desktop", browser: "Chrome 124", timestamp: "2025-06-20 14:15", success: true },
  { id: 3, action: "Ticket #892 Created", category: "support", ip: "185.234.21.10", location: "Frankfurt, DE", device: "Desktop", browser: "Chrome 124", timestamp: "2025-06-19 22:10", success: true },
  { id: 4, action: "Password Changed", category: "security", ip: "185.234.21.10", location: "Frankfurt, DE", device: "Desktop", browser: "Chrome 124", timestamp: "2025-06-18 16:44", success: true },
  { id: 5, action: "Failed Login Attempt", category: "auth", ip: "45.77.100.12", location: "Unknown", device: "Unknown", browser: "Unknown", timestamp: "2025-06-17 03:21", success: false },
  { id: 6, action: "Server MC-0392 Ordered", category: "server", ip: "185.234.21.10", location: "Frankfurt, DE", device: "Mobile", browser: "Safari 17", timestamp: "2025-06-15 11:08", success: true },
  { id: 7, action: "Profile Updated", category: "account", ip: "185.234.21.10", location: "Frankfurt, DE", device: "Desktop", browser: "Firefox 126", timestamp: "2025-06-14 09:30", success: true },
  { id: 8, action: "Logout", category: "auth", ip: "185.234.21.10", location: "Frankfurt, DE", device: "Desktop", browser: "Chrome 124", timestamp: "2025-06-13 18:00", success: true },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  auth: LogIn, billing: DollarSign, support: Ticket, security: Shield, server: Server, account: Settings,
};

export default function ClientActivity() {
  const [search, setSearch] = useState("");

  const filtered = ACTIVITIES.filter(a =>
    a.action.toLowerCase().includes(search.toLowerCase()) ||
    a.ip.includes(search) ||
    a.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ClientLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">Activity History</h1>
            <p className="text-muted-foreground text-sm mt-1">All actions performed on your account.</p>
          </div>
          <Button variant="outline" className="border-white/10 text-muted-foreground hover:text-white">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Actions", value: ACTIVITIES.length },
            { label: "Successful", value: ACTIVITIES.filter(a => a.success).length },
            { label: "Failed", value: ACTIVITIES.filter(a => !a.success).length },
            { label: "Unique IPs", value: [...new Set(ACTIVITIES.map(a => a.ip))].length },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="glass-panel p-4 rounded-2xl text-center">
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search activity..." className="pl-10 bg-black/50 border-white/10 text-white" />
        </div>

        {/* Activity list */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-black/30">
                  {["Action", "IP / Location", "Device", "Time", "Status"].map(h => (
                    <th key={h} className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => {
                  const Icon = CATEGORY_ICONS[a.category] ?? Settings;
                  return (
                    <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      className="border-b border-white/5 hover:bg-white/2 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-white font-medium text-sm">{a.action}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-white font-mono">{a.ip}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Globe className="w-3 h-3" />{a.location}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          {a.device === "Mobile" ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                          {a.device} · {a.browser}
                        </div>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground font-mono whitespace-nowrap">{a.timestamp}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${a.success ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"}`}>
                          {a.success ? "Success" : "Failed"}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
