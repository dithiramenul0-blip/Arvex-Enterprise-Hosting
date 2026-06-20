import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bell, DollarSign, Server, Ticket, Shield, CheckCheck, Trash2, Settings, X } from "lucide-react";
import { ClientLayout } from "@/components/ClientLayout";

interface Notification {
  id: number;
  title: string;
  body: string;
  type: "billing" | "server" | "ticket" | "security" | "system";
  read: boolean;
  time: string;
}

const ICONS = { billing: DollarSign, server: Server, ticket: Ticket, security: Shield, system: Bell };
const COLORS = {
  billing: "text-green-400 bg-green-500/10",
  server: "text-blue-400 bg-blue-500/10",
  ticket: "text-primary bg-primary/10",
  security: "text-red-400 bg-red-500/10",
  system: "text-yellow-400 bg-yellow-500/10",
};

const INITIAL: Notification[] = [
  { id: 1, title: "Invoice #1047 Paid", body: "Your payment of $9.99 for VPS Starter has been received. Thank you!", type: "billing", read: false, time: "5 min ago" },
  { id: 2, title: "New Ticket Reply", body: "Your support ticket #892 received a reply from our team. Click to view.", type: "ticket", read: false, time: "1h ago" },
  { id: 3, title: "Server Provisioned", body: "Your Minecraft Basic server (MC-0392) is now live and ready to use.", type: "server", read: false, time: "2h ago" },
  { id: 4, title: "Login from New Device", body: "A login was detected from a new IP: 185.100.20.14 (Frankfurt, Germany). Not you? Secure your account.", type: "security", read: true, time: "Yesterday" },
  { id: 5, title: "Invoice Due Soon", body: "Invoice #1048 of $9.99 is due in 3 days. Pay now to avoid service interruption.", type: "billing", read: true, time: "2 days ago" },
  { id: 6, title: "Scheduled Maintenance", body: "Maintenance on Frankfurt nodes Jun 22, 02:00–04:00 UTC. Brief interruptions expected.", type: "system", read: true, time: "3 days ago" },
  { id: 7, title: "Password Changed", body: "Your account password was changed successfully. If this wasn't you, contact support.", type: "security", read: true, time: "1 week ago" },
];

export default function ClientNotifications() {
  const [items, setItems] = useState<Notification[]>(INITIAL);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const markRead = (id: number) => setItems(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setItems(p => p.map(n => ({ ...n, read: true })));
  const remove = (id: number) => setItems(p => p.filter(n => n.id !== id));

  const filtered = filter === "unread" ? items.filter(n => !n.read) : items;
  const unreadCount = items.filter(n => !n.read).length;

  return (
    <ClientLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              Notifications
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-black">{unreadCount}</span>
              )}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Stay up-to-date with your account activity.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex rounded-xl overflow-hidden border border-white/10">
              {(["all", "unread"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${filter === f ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}>
                  {f}
                </button>
              ))}
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllRead} className="border-white/10 text-muted-foreground hover:text-white text-xs">
                <CheckCheck className="w-3.5 h-3.5 mr-1.5" /> Mark all read
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((n, i) => {
            const Icon = ICONS[n.type];
            const color = COLORS[n.type];
            return (
              <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => markRead(n.id)}
                className={`glass-panel p-5 rounded-2xl flex gap-4 cursor-pointer transition-all hover:border-primary/30 relative ${!n.read ? "border-l-2 border-l-primary" : ""}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-bold ${!n.read ? "text-white" : "text-muted-foreground"}`}>{n.title}</span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{n.body}</p>
                  <p className="text-muted-foreground/50 text-xs mt-2">{n.time}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); remove(n.id); }} className="text-muted-foreground/30 hover:text-muted-foreground transition-colors p-1 shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <div className="glass-panel p-16 rounded-2xl text-center">
              <Bell className="w-12 h-12 text-primary/20 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No {filter === "unread" ? "unread " : ""}notifications</p>
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-black text-white uppercase tracking-tight">Notification Preferences</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              ["Billing alerts", true], ["Server status", true], ["Ticket replies", true],
              ["Security alerts", true], ["Maintenance notices", false], ["Marketing emails", false],
            ].map(([label, defaultOn], i) => (
              <label key={i} className="flex items-center justify-between p-3 rounded-xl bg-black/30 cursor-pointer">
                <span className="text-sm text-muted-foreground font-medium">{label as string}</span>
                <input type="checkbox" defaultChecked={defaultOn as boolean} className="w-4 h-4 accent-primary" />
              </label>
            ))}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
