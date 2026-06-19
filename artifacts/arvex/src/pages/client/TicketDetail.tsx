import { useState } from "react";
import { useGetTicket, getGetTicketQueryKey, useReplyTicket, useCloseTicket } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, User, Shield } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function TicketDetail({ id }: { id: string }) {
  const [replyMessage, setReplyMessage] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const ticketId = parseInt(id);

  const { data: ticket, isLoading } = useGetTicket(ticketId, {
    query: {
      enabled: !!ticketId,
      queryKey: getGetTicketQueryKey(ticketId)
    }
  });

  const replyMutation = useReplyTicket({
    mutation: {
      onSuccess: () => {
        setReplyMessage("");
        queryClient.invalidateQueries({ queryKey: getGetTicketQueryKey(ticketId) });
        toast({ title: "Reply sent", description: "Your message has been added to the ticket." });
      }
    }
  });

  const closeMutation = useCloseTicket({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetTicketQueryKey(ticketId) });
        toast({ title: "Ticket closed", description: "The ticket has been marked as closed." });
      }
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!ticket) return <div>Ticket not found</div>;

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    replyMutation.mutate({ id: ticketId, data: { message: replyMessage } });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/client/tickets">
          <Button variant="outline" size="icon" className="border-white/10 hover:bg-white/10 text-white">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white mb-1">{ticket.subject}</h1>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-white/5 border-white/10 uppercase text-[10px]">
              {ticket.department}
            </Badge>
            <Badge variant="outline" className="bg-white/5 border-white/10 uppercase text-[10px]">
              {ticket.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        {ticket.status !== 'closed' && (
          <Button 
            variant="outline" 
            className="border-red-500/50 text-red-500 hover:bg-red-500/20"
            onClick={() => closeMutation.mutate({ id: ticketId })}
            disabled={closeMutation.isPending}
          >
            Close Ticket
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {ticket.replies?.map((reply) => (
          <Card key={reply.id} className={`border-white/10 ${reply.isStaff ? 'bg-primary/5 border-primary/20' : 'glass-panel'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${reply.isStaff ? 'bg-primary text-white' : 'bg-white/10 text-white'}`}>
                    {reply.isStaff ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className={`font-medium ${reply.isStaff ? 'text-primary' : 'text-white'}`}>
                      {reply.isStaff ? 'ArveX Staff' : 'You'}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(reply.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="prose prose-invert max-w-none text-sm text-gray-300">
                {reply.message.split('\n').map((line, i) => (
                  <p key={i} className="mb-1">{line}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {ticket.status !== 'closed' && (
        <Card className="glass-panel border-white/10 mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">Reply to Ticket</h3>
            <form onSubmit={handleReply} className="space-y-4">
              <Textarea 
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="min-h-[150px] bg-black/50 border-white/10"
                placeholder="Type your reply here..."
                required
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 text-white"
                  disabled={replyMutation.isPending || !replyMessage.trim()}
                >
                  {replyMutation.isPending ? "Sending..." : "Send Reply"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
