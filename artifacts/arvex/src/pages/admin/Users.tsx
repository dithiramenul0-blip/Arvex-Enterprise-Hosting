import { useAdminGetUsers, useBanUser, useAdminUpdateUser, getAdminGetUsersQueryKey } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsers() {
  const { data: users, isLoading } = useAdminGetUsers();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const banMutation = useBanUser({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminGetUsersQueryKey() });
        toast({ title: "User banned", description: "User has been banned successfully." });
      }
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Manage Users</h1>

      <Card className="glass-panel border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black/40 border-b border-white/10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">ID</TableHead>
                <TableHead className="text-muted-foreground font-medium">Name</TableHead>
                <TableHead className="text-muted-foreground font-medium">Email</TableHead>
                <TableHead className="text-muted-foreground font-medium">Role</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-right text-muted-foreground font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Loading users...</TableCell>
                </TableRow>
              ) : users?.map((user) => (
                <TableRow key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <TableCell className="font-medium text-white">#{user.id}</TableCell>
                  <TableCell className="text-white">{user.firstName} {user.lastName}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`uppercase text-[10px] tracking-wider ${user.role === 'admin' ? 'bg-primary/20 text-primary border-primary/20' : 'bg-white/10 text-white border-white/10'}`}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`uppercase text-[10px] tracking-wider ${user.status === 'active' ? 'bg-green-500/20 text-green-500 border-green-500/20' : 'bg-red-500/20 text-red-500 border-red-500/20'}`}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {user.status !== 'banned' && user.role !== 'admin' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 border-red-500/20 hover:bg-red-500/20"
                        onClick={() => banMutation.mutate({ id: user.id })}
                        disabled={banMutation.isPending}
                      >
                        Ban
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
