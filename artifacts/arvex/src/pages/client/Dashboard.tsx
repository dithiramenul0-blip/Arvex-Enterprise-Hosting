import { useGetServices, useGetOrders, useGetTickets } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, ShoppingCart, Ticket, Activity } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function ClientDashboard() {
  const { data: services } = useGetServices();
  const { data: orders } = useGetOrders();
  const { data: tickets } = useGetTickets();

  const activeServices = services?.filter(s => s.status === 'active') || [];
  const openTickets = tickets?.filter(t => t.status !== 'closed') || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-muted-foreground">Here's an overview of your infrastructure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-panel border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Services</CardTitle>
            <Server className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeServices.length}</div>
          </CardContent>
        </Card>
        
        <Card className="glass-panel border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{orders?.length || 0}</div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{openTickets.length}</div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Network Status</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-500">All Systems Operational</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-panel border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-white">Recent Services</CardTitle>
            <Link href="/client/services">
              <Button variant="ghost" className="text-primary hover:text-white hover:bg-primary/20">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {activeServices.length > 0 ? (
              <div className="space-y-4">
                {activeServices.slice(0, 3).map(service => (
                  <div key={service.id} className="flex justify-between items-center p-4 rounded-lg bg-black/40 border border-white/5">
                    <div>
                      <div className="font-medium text-white">{service.planName || 'Service'}</div>
                      <div className="text-sm text-muted-foreground">{service.serverIp || 'Provisioning...'}</div>
                    </div>
                    <div className="text-sm px-2 py-1 rounded bg-green-500/20 text-green-500">
                      Active
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No active services found.</div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-white">Recent Tickets</CardTitle>
            <Link href="/client/tickets">
              <Button variant="ghost" className="text-primary hover:text-white hover:bg-primary/20">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {tickets && tickets.length > 0 ? (
              <div className="space-y-4">
                {tickets.slice(0, 3).map(ticket => (
                  <div key={ticket.id} className="flex justify-between items-center p-4 rounded-lg bg-black/40 border border-white/5">
                    <div>
                      <div className="font-medium text-white">{ticket.subject}</div>
                      <div className="text-sm text-muted-foreground">Updated: {new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className={`text-sm px-2 py-1 rounded ${ticket.status === 'open' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white'}`}>
                      {ticket.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No recent tickets.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
