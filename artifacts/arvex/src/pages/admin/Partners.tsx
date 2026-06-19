import { useState } from "react";
import { useGetPartners, getGetPartnersQueryKey, useCreatePartner, useDeletePartner } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AdminPartners() {
  const { data: partners, isLoading } = useGetPartners();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const createMutation = useCreatePartner({
    mutation: {
      onSuccess: () => {
        setName("");
        setLogoUrl("");
        queryClient.invalidateQueries({ queryKey: getGetPartnersQueryKey() });
        toast({ title: "Partner added", description: "Successfully added new partner." });
      }
    }
  });

  const deleteMutation = useDeletePartner({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetPartnersQueryKey() });
        toast({ title: "Partner removed", description: "Partner removed successfully." });
      }
    }
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ data: { name, logoUrl } });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Manage Partners</h1>

      <Card className="glass-panel border-white/10 mb-8">
        <CardHeader>
          <CardTitle className="text-white">Add New Partner</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm text-muted-foreground">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required className="bg-black/50 border-white/10" />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm text-muted-foreground">Logo URL (image)</label>
              <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} required className="bg-black/50 border-white/10" />
            </div>
            <Button type="submit" className="bg-primary text-white" disabled={createMutation.isPending}>Add Partner</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="glass-panel border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black/40 border-b border-white/10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">Logo</TableHead>
                <TableHead className="text-muted-foreground font-medium">Name</TableHead>
                <TableHead className="text-right text-muted-foreground font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">Loading partners...</TableCell>
                </TableRow>
              ) : partners?.map((partner) => (
                <TableRow key={partner.id} className="border-b border-white/5 hover:bg-white/5">
                  <TableCell>
                    <img src={partner.logoUrl} alt={partner.name} className="h-8 object-contain" />
                  </TableCell>
                  <TableCell className="text-white font-medium">{partner.name}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => {
                        if (confirm("Remove partner?")) deleteMutation.mutate({ id: partner.id });
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
