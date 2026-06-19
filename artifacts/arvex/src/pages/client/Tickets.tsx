import { useGetTickets } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus } from "lucide-react";

export default function ClientTickets() {
  const { data: tickets, isLoading } = useGetTickets();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500/20 text-green-500 border-green-500/20';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20';
      case 'closed': return 'bg-white/10 text-muted-foreground border-white/10';
      default: return 'bg-white/10 text-white border-white/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'urgent': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-muted-foreground';
      default: return 'text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Support Tickets</h1>
        <Link href="/client/tickets/new">
          <Button className="bg-primary hover:bg-primary/90 text-white glow-border">
            <Plus className="w-4 h-4 mr-2" /> Open Ticket
          </Button>
        </Link>
      </div>

      <Card className="glass-panel border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black/40 border-b border-white/10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium w-[100px]">ID</TableHead>
                <TableHead className="text-muted-foreground font-medium">Subject</TableHead>
                <TableHead className="text-muted-foreground font-medium">Department</TableHead>
                <TableHead className="text-muted-foreground font-medium">Priority</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Loading tickets...</TableCell>
                </TableRow>
              ) : tickets?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">You don't have any tickets.</TableCell>
                </TableRow>
              ) : (
                tickets?.map((ticket) => (
                  <TableRow key={ticket.id} className="border-b border-white/5 hover:bg-white/5 cursor-pointer">
                    <TableCell className="font-medium text-muted-foreground">#{ticket.id}</TableCell>
                    <TableCell>
                      <Link href={`/client/tickets/${ticket.id}`} className="text-white hover:text-primary font-medium block">
                        {ticket.subject}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground capitalize">{ticket.department}</TableCell>
                    <TableCell className={`capitalize font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`uppercase text-[10px] tracking-wider ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString()}
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
