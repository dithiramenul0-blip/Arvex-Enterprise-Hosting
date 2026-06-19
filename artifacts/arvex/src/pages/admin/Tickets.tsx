import { useGetTickets } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function AdminTickets() {
  const { data: tickets, isLoading } = useGetTickets();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Manage Tickets</h1>

      <Card className="glass-panel border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black/40 border-b border-white/10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">ID</TableHead>
                <TableHead className="text-muted-foreground font-medium">User ID</TableHead>
                <TableHead className="text-muted-foreground font-medium">Subject</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Loading tickets...</TableCell>
                </TableRow>
              ) : tickets?.map((ticket) => (
                <TableRow key={ticket.id} className="border-b border-white/5 hover:bg-white/5">
                  <TableCell className="font-medium text-muted-foreground">#{ticket.id}</TableCell>
                  <TableCell className="text-muted-foreground">{ticket.userId}</TableCell>
                  <TableCell>
                    <Link href={`/client/tickets/${ticket.id}`} className="text-white hover:text-primary font-medium block">
                      {ticket.subject}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase text-[10px] tracking-wider bg-white/10 text-white border-white/10">
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString()}
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
