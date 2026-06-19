import { useGetServices, useGetProvisionStatus, getGetProvisionStatusQueryKey } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, ExternalLink, Activity } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";

export default function ClientServices() {
  const { data: services, isLoading } = useGetServices();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]';
      case 'suspended': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
      default: return 'bg-white/5 text-white border-white/10';
    }
  };

  return (
    <PageTransition className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3 glow-text">
            <Activity className="w-8 h-8 text-primary" />
            My Instances
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage your deployed game servers and infrastructure.</p>
        </div>
      </div>

      <Card className="glass-panel border-glow">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black/40 border-b border-white/10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Service</TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Network</TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Billing Status</TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Provision State</TableHead>
                <TableHead className="text-right text-muted-foreground font-bold uppercase tracking-wider text-xs">Access</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-primary font-bold uppercase tracking-widest">Locating instances...</TableCell>
                </TableRow>
              ) : services?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground font-medium">No active instances in your command center.</TableCell>
                </TableRow>
              ) : (
                services?.map((service) => (
                  <ServiceRow key={service.id} service={service} getStatusColor={getStatusColor} />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageTransition>
  );
}

// Sub-component to handle individual row polling
function ServiceRow({ service, getStatusColor }: { service: any, getStatusColor: any }) {
  // Only poll if it's currently provisioning
  const isProvisioning = service.provisionStatus === 'provisioning';
  const { data: provStatus } = useGetProvisionStatus(service.id, {
    query: { 
      enabled: !!service.id && isProvisioning,
      refetchInterval: isProvisioning ? 5000 : false,
      queryKey: getGetProvisionStatusQueryKey(service.id)
    }
  });

  // Use the live status if we're polling, otherwise fallback to the service record
  const currentProvStatus = provStatus?.status || service.provisionStatus || 'pending';
  const ip = provStatus?.serverIp || service.serverIp;
  const hostname = provStatus?.hostname || service.hostname;
  const consoleUrl = provStatus?.consoleUrl;

  const getProvBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-500/20 text-green-500 border-green-500/30 uppercase text-[10px] tracking-widest font-bold">Ready</Badge>;
      case 'provisioning': return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 animate-pulse uppercase text-[10px] tracking-widest font-bold">Building...</Badge>;
      case 'failed': return <Badge className="bg-red-500/20 text-red-500 border-red-500/30 uppercase text-[10px] tracking-widest font-bold">Failed</Badge>;
      default: return <Badge className="bg-white/10 text-white border-white/20 uppercase text-[10px] tracking-widest font-bold">{status || 'Pending'}</Badge>;
    }
  };

  return (
    <TableRow className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <TableCell>
        <div className="font-bold text-white text-sm uppercase tracking-tight">{service.planName || `Instance #${service.id}`}</div>
        <div className="text-xs text-muted-foreground mt-1">ID: {service.id}</div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {ip ? (
          <div className="font-mono text-xs bg-black/50 px-2 py-1 rounded border border-white/5 inline-block text-white/90">
            {ip}
          </div>
        ) : <span className="text-xs">-</span>}
        {hostname && <div className="text-[10px] uppercase tracking-wider mt-1">{hostname}</div>}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={`uppercase text-[10px] tracking-widest font-bold ${getStatusColor(service.status)}`}>
          {service.status}
        </Badge>
      </TableCell>
      <TableCell>
        {getProvBadge(currentProvStatus)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {consoleUrl && currentProvStatus === 'completed' && (
            <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/20 hover:text-white uppercase tracking-widest text-[10px] font-bold h-8" onClick={() => window.open(consoleUrl, '_blank')}>
              <ExternalLink className="w-3 h-3 mr-1.5" />
              Console
            </Button>
          )}
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white uppercase tracking-widest text-[10px] font-bold h-8">
            <Settings className="w-3 h-3 mr-1.5" />
            Manage
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
