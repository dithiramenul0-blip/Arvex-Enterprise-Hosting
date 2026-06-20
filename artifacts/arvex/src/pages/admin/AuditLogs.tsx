import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Search, Download, Filter, User, Settings, DollarSign, Server, Ticket, AlertCircle, Eye, RefreshCw } from "lucide-react";

interface LogEntry {
  id: number;
  action: string;
  actor: string;
  actorRole: "admin" | "client" | "system";
  target: string;
  category: "auth" | "billing" | "server" | "admin" | "support" | "system";
  severity: "info" | "warning" | "critical";
  ip: string;
  timestamp: string;
}

const LOGS: LogEntry[] = [
  { id: 1, action: "Admin login", actor: "admin@arvex.host", actorRole: "admin", target: "Auth System", category: "auth", severity: "info", ip: "185.234.21.10", timestamp: "2025-06-20 14:32:11" },
  { id: 2, action: "User banned", actor: "admin@arvex.host", actorRole: "admin", target: "user@example.com", category: "admin", severity: "warning", ip: "185.234.21.10", timestamp: "2025-06-20 14:28:05" },
  { id: 3, action: "Invoice #1047 paid", actor: "client@domain.com", actorRole: "client", target: "Invoice #1047", category: "billing", severity: "info", ip: "94.102.50.88", timestamp: "2025-06-20 14:15:42" },
  { id: 4, action: "Server suspended (unpaid)", actor: "system", actorRole: "system", target: "VPS-0248", category: "server", severity: "warning", ip: "127.0.0.1", timestamp: "2025-06-20 13:55:00" },
  { id: 5, action: "Failed login attempt (x5)", actor: "unknown", actorRole: "client", target: "admin@arvex.host", category: "auth", severity: "critical", ip: "45.77.100.12", timestamp: "2025-06-20 13:40:19" },
  { id: 6, action: "Plan deleted", actor: "admin@arvex.host", actorRole: "admin", target: "VPS Starter (old)", category: "admin", severity: "warning", ip: "185.234.21.10", timestamp: "2025-06-20 13:20:08" },
  { id: 7, action: "Coupon SAVE20 created", actor: "admin@arvex.host", actorRole: "admin", target: "SAVE20", category: "admin", severity: "info", ip: "185.234.21.10", timestamp: "2025-06-20 13:10:44" },
  { id: 8, action: "Support ticket #892 closed", actor: "admin@arvex.host", actorRole: "admin", target: "Ticket #892", category: "support", severity: "info", ip: "185.234.21.10", timestamp: "2025-06-20 12:58:21" },
  { id: 9, action: "Auto-backup completed", actor: "system", actorRole: "system", target: "All Servers", category: "system", severity: "info", ip: "127.0.0.1", timestamp: "2025-06-20 12:00:00" },
  { id: 10, action: "Password reset requested", actor: "user2@test.com", actorRole: "client", target: "user2@test.com", category: "auth", severity: "info", ip: "188.65.20.14", timestamp: "2025-06-20 11:45:33" },
  { id: 11, action: "New server provisioned", actor: "system", actorRole: "system", target: "MC-0392", category: "server", severity: "info", ip: "127.0.0.1", timestamp: "2025-06-20 11:30:11" },
  { id: 12, action: "Refund issued $9.99", actor: "admin@arvex.host", actorRole: "admin", target: "Invoice #1031", category: "billing", severity: "warning", ip: "185.234.21.10", timestamp: "2025-06-20 11:10:05" },
];

const CAT_ICONS: Record<string, React.ElementType> = {
  auth: Shield, billing: DollarSign, server: Server,
  admin: Settings, support: Ticket, system: RefreshCw,
};

const SEV_COLORS = {
  info: "text-blue-400 bg-blue-500/10",
  warning: "text-yellow-400 bg-yellow-500/10",
  critical: "text-red-400 bg-red-500/10",
};

const ROLE_COLORS = {
  admin: "text-primary bg-primary/10",
  client: "text-cyan-400 bg-cyan-500/10",
  system: "text-muted-foreground bg-white/5",
};

export default function AdminAuditLogs() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [sev, setSev] = useState("all");

  const filtered = LOGS.filter(l =>
    (cat === "all" || l.category === cat) &&
    (sev === "all" || l.severity === sev) &&
    (search === "" || l.action.toLowerCase().includes(search.toLowerCase()) || l.actor.toLowerCase().includes(search.toLowerCase()) || l.target.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">Full audit trail of all admin, billing, and system events.</p>
        </div>
        <Button variant="outline" className="border-white/10 text-muted-foreground hover:text-white">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Events", value: LOGS.length, color: "text-white" },
          { label: "Info", value: LOGS.filter(l => l.severity === "info").length, color: "text-blue-400" },
          { label: "Warnings", value: LOGS.filter(l => l.severity === "warning").length, color: "text-yellow-400" },
          { label: "Critical", value: LOGS.filter(l => l.severity === "critical").length, color: "text-red-400" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="glass-panel p-5 rounded-2xl text-center">
            <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs..." className="pl-10 bg-black/50 border-white/10 text-white" />
        </div>
        <div className="flex rounded-xl overflow-hidden border border-white/10">
          {["all", "auth", "billing", "server", "admin", "support", "system"].map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors ${cat === c ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex rounded-xl overflow-hidden border border-white/10">
          {["all", "info", "warning", "critical"].map(s => (
            <button key={s} onClick={() => setSev(s)}
              className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors ${sev === s ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Log Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-black/30">
                {["Timestamp", "Action", "Actor", "Target", "Category", "Severity", "IP"].map(h => (
                  <th key={h} className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => {
                const Icon = CAT_ICONS[log.category] ?? Eye;
                return (
                  <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="p-4 text-xs text-muted-foreground font-mono whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-4 text-sm text-white font-medium whitespace-nowrap">{log.action}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${ROLE_COLORS[log.actorRole]}`}>{log.actorRole}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]">{log.actor}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground font-medium truncate max-w-[120px]">{log.target}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-primary/60" />
                        <span className="text-xs text-muted-foreground capitalize">{log.category}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${SEV_COLORS[log.severity]}`}>{log.severity}</span>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground font-mono">{log.ip}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground font-medium">No log entries match your filters.</div>
        )}
      </div>
    </div>
  );
}
