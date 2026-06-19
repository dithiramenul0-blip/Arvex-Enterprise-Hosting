import { useGetOrders } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ClientOrders() {
  const { data: orders, isLoading } = useGetOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-500 border-green-500/20';
      case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20';
      case 'cancelled': return 'bg-red-500/20 text-red-500 border-red-500/20';
      default: return 'bg-white/10 text-white border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Order History</h1>

      <Card className="glass-panel border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black/40 border-b border-white/10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">Order ID</TableHead>
                <TableHead className="text-muted-foreground font-medium">Date</TableHead>
                <TableHead className="text-muted-foreground font-medium">Service</TableHead>
                <TableHead className="text-muted-foreground font-medium">Amount</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Loading orders...</TableCell>
                </TableRow>
              ) : orders?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">You don't have any orders.</TableCell>
                </TableRow>
              ) : (
                orders?.map((order) => (
                  <TableRow key={order.id} className="border-b border-white/5 hover:bg-white/5">
                    <TableCell className="font-medium text-white">#{order.id}</TableCell>
                    <TableCell className="text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-white">{order.planName || `Plan #${order.planId}`}</TableCell>
                    <TableCell className="text-white font-medium">${order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`uppercase text-[10px] tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                      </Badge>
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
