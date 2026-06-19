import { useGetServices } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function ClientServices() {
  const { data: services, isLoading } = useGetServices();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-500 border-green-500/20';
      case 'suspended': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20';
      case 'cancelled': return 'bg-red-500/20 text-red-500 border-red-500/20';
      default: return 'bg-white/10 text-white border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">My Services</h1>
      </div>

      <Card className="glass-panel border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black/40 border-b border-white/10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">Service</TableHead>
                <TableHead className="text-muted-foreground font-medium">IP / Hostname</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium">Next Due</TableHead>
                <TableHead className="text-right text-muted-foreground font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Loading services...</TableCell>
                </TableRow>
              ) : services?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">You don't have any active services.</TableCell>
                </TableRow>
              ) : (
                services?.map((service) => (
                  <TableRow key={service.id} className="border-b border-white/5 hover:bg-white/5">
                    <TableCell className="font-medium text-white">{service.planName || `Plan #${service.planId}`}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {service.serverIp ? (
                        <span className="font-mono text-xs bg-black/50 px-2 py-1 rounded border border-white/5">{service.serverIp}</span>
                      ) : '-'}
                      {service.hostname && <div className="text-xs mt-1">{service.hostname}</div>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`uppercase text-[10px] tracking-wider ${getStatusColor(service.status)}`}>
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{new Date(service.expiresAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
