import { useGetPlans, getGetPlansQueryKey, useDeletePlan } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AdminPlans() {
  const { data: plans, isLoading } = useGetPlans();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useDeletePlan({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetPlansQueryKey() });
        toast({ title: "Plan deleted", description: "The plan was successfully deleted." });
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Manage Plans</h1>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Plan
        </Button>
      </div>

      <Card className="glass-panel border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black/40 border-b border-white/10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">Name</TableHead>
                <TableHead className="text-muted-foreground font-medium">Category</TableHead>
                <TableHead className="text-muted-foreground font-medium">Price</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-right text-muted-foreground font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Loading plans...</TableCell>
                </TableRow>
              ) : plans?.map((plan) => (
                <TableRow key={plan.id} className="border-b border-white/5 hover:bg-white/5">
                  <TableCell className="font-medium text-white">{plan.name} {plan.isFeatured && "🌟"}</TableCell>
                  <TableCell className="text-muted-foreground capitalize">{plan.category}</TableCell>
                  <TableCell className="text-white">${plan.price}/mo</TableCell>
                  <TableCell className="text-muted-foreground">{plan.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => {
                        if (confirm("Are you sure?")) deleteMutation.mutate({ id: plan.id });
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
