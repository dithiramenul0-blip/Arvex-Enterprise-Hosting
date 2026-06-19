import { useAdminGetServices, getAdminGetServicesQueryKey, useSuspendService, useUnsuspendService } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AdminServices() {
  const { data: services, isLoading } = useAdminGetServices();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const suspendMutation = useSuspendService({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminGetServicesQueryKey() });
        toast({ title: "Service suspended", description: "The service has been suspended." });
      }
    }
  });

  const unsuspendMutation = useUnsuspendService({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminGetServicesQueryKey() });
        toast({ title: "Service unsuspended", description: "The service has been unsuspended." });
      }
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Manage Services</h1>

      <Card className="glass-panel border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black/40 border-b border-white/10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">ID</TableHead>
                <TableHead className="text-muted-foreground font-medium">User ID</TableHead>
                <TableHead className="text-muted-foreground font-medium">Plan</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-right text-muted-foreground font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Loading services...</TableCell>
                </TableRow>
              ) : services?.map((service) => (
                <TableRow key={service.id} className="border-b border-white/5 hover:bg-white/5">
                  <TableCell className="font-medium text-white">#{service.id}</TableCell>
                  <TableCell className="text-muted-foreground">{service.userId}</TableCell>
                  <TableCell className="text-white">{service.planName || `Plan #${service.planId}`}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase text-[10px] tracking-wider bg-white/10 text-white border-white/10">
                      {service.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {service.status === 'active' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20"
                        onClick={() => suspendMutation.mutate({ id: service.id })}
                        disabled={suspendMutation.isPending}
                      >
                        Suspend
                      </Button>
                    )}
                    {service.status === 'suspended' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-500 border-green-500/20 hover:bg-green-500/20"
                        onClick={() => unsuspendMutation.mutate({ id: service.id })}
                        disabled={unsuspendMutation.isPending}
                      >
                        Unsuspend
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
