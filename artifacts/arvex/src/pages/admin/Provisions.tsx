import { useState, useEffect } from "react";
import { useGetProvisions, useServerAction } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Terminal, Play, Square, RotateCw, Trash2, PowerOff, ExternalLink, Server } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AdminProvisions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const { data: provisions, isLoading, refetch } = useGetProvisions();
  const serverAction = useServerAction();

  // Auto-refresh every 15s
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 15000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleAction = (serviceId: number, action: any) => {
    serverAction.mutate({
      data: { action },
      serviceId
    }, {
      onSuccess: () => {
        toast({ title: "Command Sent", description: `Executing ${action} on server...` });
        refetch();
      },
      onError: (err: any) => {
        toast({ title: "Action Failed", description: err.message, variant: "destructive" });
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-500/20 text-green-500 border-green-500/30 uppercase text-[10px] tracking-widest font-bold">Ready</Badge>;
      case 'provisioning': return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 animate-pulse uppercase text-[10px] tracking-widest font-bold">Building</Badge>;
      case 'failed': return <Badge className="bg-red-500/20 text-red-500 border-red-500/30 uppercase text-[10px] tracking-widest font-bold">Failed</Badge>;
      case 'suspended': return <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30 uppercase text-[10px] tracking-widest font-bold">Suspended</Badge>;
      default: return <Badge className="bg-white/10 text-white border-white/20 uppercase text-[10px] tracking-widest font-bold">{status}</Badge>;
    }
  };

  const filteredProvisions = provisions?.filter(p => filter === "all" || p.provisionStatus === filter) || [];

  const stats = {
    total: provisions?.length || 0,
    ready: provisions?.filter(p => p.provisionStatus === 'completed').length || 0,
    building: provisions?.filter(p => p.provisionStatus === 'provisioning').length || 0,
    failed: provisions?.filter(p => p.provisionStatus === 'failed').length || 0,
  };

  return (
    <PageTransition className="space-y-6">
      <div className="flex items-end justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3 glow-text">
            <Terminal className="w-8 h-8 text-primary" />
            Server Control Center
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">Global fleet view and power management.</p>
        </div>
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live Uplink Active
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-black/40 border-white/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Fleet</div>
              <div className="text-2xl font-black text-white">{stats.total}</div>
            </div>
            <Server className="w-8 h-8 text-white/20" />
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.05)]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-green-500 uppercase tracking-widest mb-1">Online</div>
              <div className="text-2xl font-black text-white">{stats.ready}</div>
            </div>
            <Play className="w-8 h-8 text-green-500/20" />
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.05)]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-yellow-500 uppercase tracking-widest mb-1">Deploying</div>
              <div className="text-2xl font-black text-white">{stats.building}</div>
            </div>
            <RotateCw className="w-8 h-8 text-yellow-500/20 animate-spin-slow" />
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-red-500 uppercase tracking-widest mb-1">Failed</div>
              <div className="text-2xl font-black text-white">{stats.failed}</div>
            </div>
            <PowerOff className="w-8 h-8 text-red-500/20" />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel border-glow">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="uppercase tracking-tight text-lg">Active Instances</CardTitle>
          <div className="flex items-center gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px] bg-black/50 border-white/10 text-xs font-bold uppercase tracking-wider">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                <SelectItem value="all">All Servers</SelectItem>
                <SelectItem value="completed">Ready</SelectItem>
                <SelectItem value="provisioning">Building</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="border-white/10 hover:bg-white/5 uppercase tracking-widest text-xs font-bold">
              <RotateCw className={`w-3 h-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black/40 border-y border-white/10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-xs">ID / User</TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Plan</TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Target</TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Status</TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Network</TableHead>
                <TableHead className="text-right text-muted-foreground font-bold uppercase tracking-wider text-xs">Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && provisions === undefined ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-primary font-bold uppercase tracking-widest">Scanning network...</TableCell>
                </TableRow>
              ) : filteredProvisions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground font-medium">No instances found matching criteria.</TableCell>
                </TableRow>
              ) : (
                filteredProvisions.map((prov: any) => (
                  <TableRow key={prov.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell>
                      <div className="font-bold text-white text-sm">#{prov.serviceId}</div>
                      <div className="text-xs text-muted-foreground">{prov.userEmail || `User ${prov.userId}`}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-white text-sm">{prov.planName}</div>
                      <Badge variant="outline" className="mt-1 bg-black text-muted-foreground border-white/10 uppercase text-[9px] tracking-widest font-bold">
                        {prov.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 uppercase text-[10px] tracking-widest font-bold">
                        {prov.providerType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(prov.status)}
                    </TableCell>
                    <TableCell>
                      {prov.serverIp ? (
                        <div className="font-mono text-xs bg-black/50 px-2 py-1 rounded border border-white/5 inline-block text-white/90">
                          {prov.serverIp}
                        </div>
                      ) : <span className="text-muted-foreground text-xs">-</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {prov.consoleUrl && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10" onClick={() => window.open(prov.consoleUrl, '_blank')} title="Open Console">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10" onClick={() => handleAction(prov.serviceId, 'start')} title="Start">
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-500 hover:text-orange-400 hover:bg-orange-500/10" onClick={() => handleAction(prov.serviceId, 'stop')} title="Stop">
                          <Square className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10" onClick={() => handleAction(prov.serviceId, 'restart')} title="Restart">
                          <RotateCw className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleAction(prov.serviceId, 'kill')} title="Kill">
                          <PowerOff className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageTransition>
  );
}
