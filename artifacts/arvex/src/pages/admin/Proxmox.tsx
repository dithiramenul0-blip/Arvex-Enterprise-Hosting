import { useState, useEffect } from "react";
import { useGetProxmoxSettings, useUpdateProxmoxSettings } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Cpu, CheckCircle, XCircle, Info } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";

export default function AdminProxmox() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useGetProxmoxSettings();
  const updateSettings = useUpdateProxmoxSettings();

  const [formData, setFormData] = useState({
    url: "",
    username: "",
    password: "",
    defaultNode: "",
    isEnabled: false
  });

  useEffect(() => {
    if (settings) {
      const s = settings as any;
      setFormData({
        url: s.apiUrl || "",
        username: s.username || "",
        password: s.password ? "********" : "",
        defaultNode: s.defaultNodeId || "",
        isEnabled: s.isEnabled || false
      });
    }
  }, [settings]);

  const handleSave = () => {
    const payload: any = { ...formData };
    if (payload.password === "********") delete payload.password;

    updateSettings.mutate({ data: payload }, {
      onSuccess: () => {
        toast({ title: "Success", description: "Proxmox settings updated" });
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err.message || "Failed to update settings", variant: "destructive" });
      }
    });
  };

  if (isLoading) return <div className="p-8 text-center text-white">Loading...</div>;

  return (
    <PageTransition className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3 glow-text">
            <Cpu className="w-8 h-8 text-primary" />
            Proxmox Integration
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage KVM virtualization cluster connection.</p>
        </div>
        {settings?.isEnabled ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-500 font-bold uppercase tracking-widest text-xs">
            <CheckCircle className="w-4 h-4" /> Connected
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-500 font-bold uppercase tracking-widest text-xs">
            <XCircle className="w-4 h-4" /> Disconnected
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-panel border-glow">
          <CardHeader>
            <CardTitle className="uppercase tracking-tight">Cluster Settings</CardTitle>
            <CardDescription>API details for your Proxmox VE cluster</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 mb-4">
              <div className="space-y-0.5">
                <Label className="text-base">Enable Integration</Label>
                <div className="text-sm text-muted-foreground">Allow automatic provisioning of VPS/VDS</div>
              </div>
              <Switch checked={formData.isEnabled} onCheckedChange={(c) => setFormData({...formData, isEnabled: c})} />
            </div>

            <div className="space-y-2">
              <Label>API URL</Label>
              <Input 
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                placeholder="https://pve.example.com:8006"
                className="bg-black/50 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="root@pam"
                className="bg-black/50 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Password / Token Secret</Label>
              <Input 
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="********"
                className="bg-black/50 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Default Node</Label>
              <Input 
                value={formData.defaultNode}
                onChange={(e) => setFormData({...formData, defaultNode: e.target.value})}
                placeholder="pve"
                className="bg-black/50 border-white/10"
              />
            </div>

            <Button onClick={handleSave} disabled={updateSettings.isPending} className="w-full mt-4 btn-glow bg-primary hover:bg-primary/90 uppercase tracking-widest font-bold">
              {updateSettings.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="glass-panel border-white/10 bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Info className="w-6 h-6 text-primary shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-bold text-white uppercase tracking-tight">How Proxmox Provisioning Works</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    When a user orders a VPS or VDS plan mapped to Proxmox, the system will automatically:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                    <li>Create a new KVM Virtual Machine or LXC Container on the default node</li>
                    <li>Allocate CPU cores, RAM, and Disk space based on the plan mapping</li>
                    <li>Assign an available IP address from your configured pool</li>
                    <li>Start the VM and email credentials to the user</li>
                  </ul>
                  <p className="text-sm text-primary font-medium mt-4">
                    Ensure your Proxmox node has a template configured with ID 100 for automatic cloning.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
