import { useState } from "react";
import { useGetPlans, useGetPlanMappings, useUpdatePlanMapping } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";

export default function AdminPlanMappings() {
  const { toast } = useToast();
  const { data: plans, isLoading: loadingPlans } = useGetPlans();
  const { data: mappings, isLoading: loadingMappings } = useGetPlanMappings();
  const updateMapping = useUpdatePlanMapping();

  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const handleEdit = (plan: any) => {
    const mapping = mappings?.find(m => m.planId === plan.id) || {
      providerType: "manual",
      nodeId: "",
      eggId: "",
      vmType: "qemu",
      cpuCores: 1,
      memoryMb: 1024,
      diskGb: 20
    };
    
    setEditingPlan(plan);
    setFormData(mapping);
  };

  const handleSave = () => {
    updateMapping.mutate({ 
      data: formData, 
      planId: editingPlan.id 
    }, {
      onSuccess: () => {
        toast({ title: "Success", description: "Plan mapping updated" });
        setEditingPlan(null);
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err.message || "Failed to update mapping", variant: "destructive" });
      }
    });
  };

  const getCategoryColor = (category: string) => {
    if (category === 'minecraft' || category === 'bot') return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (category === 'vps' || category === 'vds') return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  return (
    <PageTransition className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3 glow-text">
          <Settings className="w-8 h-8 text-primary" />
          Plan Mappings
        </h1>
        <p className="text-muted-foreground mt-2 font-medium">Link billing plans to provisioning backend resources.</p>
      </div>

      <Card className="glass-panel border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black/40 border-b border-white/10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Plan Name</TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Category</TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Provider</TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Node / Target</TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Config</TableHead>
                <TableHead className="text-right text-muted-foreground font-bold uppercase tracking-wider text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingPlans || loadingMappings ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Loading mappings...</TableCell>
                </TableRow>
              ) : plans?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No plans found.</TableCell>
                </TableRow>
              ) : (
                plans?.map((plan) => {
                  const mapping = mappings?.find(m => m.planId === plan.id);
                  const provider = mapping?.provider || 'manual';
                  
                  return (
                    <TableRow key={plan.id} className="border-b border-white/5 hover:bg-white/5">
                      <TableCell className="font-bold text-white">{plan.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`uppercase text-[10px] tracking-wider font-bold ${getCategoryColor(plan.category)}`}>
                          {plan.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-black border-white/10 text-white uppercase text-[10px] tracking-wider font-bold">
                          {provider}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {provider === 'pterodactyl' ? `Node: ${mapping?.nodeId || 'Any'} / Egg: ${mapping?.eggId || 'None'}` :
                         provider === 'proxmox' ? `Node: ${mapping?.nodeId || 'Any'} / ${mapping?.vmType?.toUpperCase() || 'QEMU'}` :
                         '-'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {mapping ? (
                          <div className="flex gap-2">
                            <span title="CPU Cores">{mapping.cpuCores}c</span>|
                            <span title="RAM">{Math.round((mapping.memoryMb || 0) / 1024)}GB</span>|
                            <span title="Disk">{mapping.diskGb}GB</span>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(plan)} className="text-primary hover:text-primary hover:bg-primary/10 uppercase tracking-widest text-xs font-bold">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Drawer open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
        <DrawerContent className="bg-card border-t border-primary/30 max-h-[90vh]">
          <div className="mx-auto w-full max-w-2xl p-6">
            <DrawerHeader>
              <DrawerTitle className="text-2xl font-black uppercase tracking-tight text-white">Configure: {editingPlan?.name}</DrawerTitle>
              <DrawerDescription>Set backend provisioning rules for this plan.</DrawerDescription>
            </DrawerHeader>
            
            <div className="p-4 space-y-6 overflow-y-auto">
              <div className="space-y-2">
                <Label>Provider Type</Label>
                <Select value={formData.provider} onValueChange={(v) => setFormData({...formData, provider: v})}>
                  <SelectTrigger className="bg-black/50 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="manual">Manual Provisioning</SelectItem>
                    <SelectItem value="pterodactyl">Pterodactyl (Game Servers)</SelectItem>
                    <SelectItem value="proxmox">Proxmox (VPS/VDS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.provider === 'pterodactyl' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Node ID (leave empty for default)</Label>
                    <Input value={formData.nodeId || ''} onChange={e => setFormData({...formData, nodeId: e.target.value})} className="bg-black/50 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Egg ID</Label>
                    <Input value={formData.eggId || ''} onChange={e => setFormData({...formData, eggId: e.target.value})} className="bg-black/50 border-white/10" />
                  </div>
                </div>
              )}

              {formData.provider === 'proxmox' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Node (leave empty for default)</Label>
                    <Input value={formData.nodeId || ''} onChange={e => setFormData({...formData, nodeId: e.target.value})} className="bg-black/50 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>VM Type</Label>
                    <Select value={formData.vmType || 'qemu'} onValueChange={(v) => setFormData({...formData, vmType: v})}>
                      <SelectTrigger className="bg-black/50 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10">
                        <SelectItem value="qemu">KVM Virtual Machine (qemu)</SelectItem>
                        <SelectItem value="lxc">LXC Container</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {(formData.providerType === 'pterodactyl' || formData.providerType === 'proxmox') && (
                <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
                  <div className="space-y-2">
                    <Label>CPU Cores</Label>
                    <Input type="number" value={formData.cpuCores || 1} onChange={e => setFormData({...formData, cpuCores: parseInt(e.target.value)})} className="bg-black/50 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Memory (MB)</Label>
                    <Input type="number" value={formData.memoryMb || 1024} onChange={e => setFormData({...formData, memoryMb: parseInt(e.target.value)})} className="bg-black/50 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Disk (GB)</Label>
                    <Input type="number" value={formData.diskGb || 20} onChange={e => setFormData({...formData, diskGb: parseInt(e.target.value)})} className="bg-black/50 border-white/10" />
                  </div>
                </div>
              )}
            </div>

            <DrawerFooter className="flex-row justify-end gap-2 border-t border-white/10 pt-4 mt-4">
              <DrawerClose asChild>
                <Button variant="outline" className="border-white/10 text-white uppercase tracking-wider font-bold">Cancel</Button>
              </DrawerClose>
              <Button onClick={handleSave} disabled={updateMapping.isPending} className="btn-glow bg-primary hover:bg-primary/90 text-white uppercase tracking-wider font-bold">
                <Save className="w-4 h-4 mr-2" />
                {updateMapping.isPending ? "Saving..." : "Save Mapping"}
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </PageTransition>
  );
}
