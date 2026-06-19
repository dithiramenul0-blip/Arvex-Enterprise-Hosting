import { useState, useEffect } from "react";
import { useGetPterodactylSettings, useUpdatePterodactylSettings, useGetPterodactylNodes, useGetPterodactylEggs, getGetPterodactylNodesQueryKey, getGetPterodactylEggsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Zap, Server, HardDrive, CheckCircle, XCircle } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";

export default function AdminPterodactyl() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useGetPterodactylSettings();
  const updateSettings = useUpdatePterodactylSettings();

  const [formData, setFormData] = useState({
    url: "",
    apiKey: "",
    clientKey: "",
    defaultNodeId: "",
    defaultEggId: "",
    isEnabled: false
  });

  useEffect(() => {
    if (settings) {
      const s = settings as any;
      setFormData({
        url: s.apiUrl || "",
        apiKey: s.apiKeyApp ? "********" : "",
        clientKey: s.apiKey ? "********" : "",
        defaultNodeId: s.defaultNodeId || "",
        defaultEggId: s.defaultEggId || "",
        isEnabled: s.isEnabled || false
      });
    }
  }, [settings]);

  const handleSave = () => {
    // Only send keys if they were changed
    const payload: any = { ...formData };
    if (payload.apiKey === "********") delete payload.apiKey;
    if (payload.clientKey === "********") delete payload.clientKey;

    updateSettings.mutate({ data: payload }, {
      onSuccess: () => {
        toast({ title: "Success", description: "Pterodactyl settings updated" });
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err.message || "Failed to update settings", variant: "destructive" });
      }
    });
  };

  const { data: nodes, refetch: fetchNodes, isFetching: loadingNodes } = useGetPterodactylNodes({ query: { enabled: false, queryKey: getGetPterodactylNodesQueryKey() } });
  const { data: eggs, refetch: fetchEggs, isFetching: loadingEggs } = useGetPterodactylEggs({ query: { enabled: false, queryKey: getGetPterodactylEggsQueryKey() } });

  if (isLoading) return <div className="p-8 text-center text-white">Loading...</div>;

  return (
    <PageTransition className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3 glow-text">
            <Zap className="w-8 h-8 text-primary" />
            Pterodactyl Integration
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage panel connection and nodes for game servers.</p>
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
            <CardTitle className="uppercase tracking-tight">Connection Settings</CardTitle>
            <CardDescription>API details for your Pterodactyl panel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 mb-4">
              <div className="space-y-0.5">
                <Label className="text-base">Enable Integration</Label>
                <div className="text-sm text-muted-foreground">Allow automatic provisioning to Pterodactyl</div>
              </div>
              <Switch checked={formData.isEnabled} onCheckedChange={(c) => setFormData({...formData, isEnabled: c})} />
            </div>

            <div className="space-y-2">
              <Label>Panel URL</Label>
              <Input 
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                placeholder="https://panel.example.com"
                className="bg-black/50 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Application API Key</Label>
              <Input 
                type="password"
                value={formData.apiKey}
                onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                placeholder="ptla_..."
                className="bg-black/50 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Client API Key (Optional)</Label>
              <Input 
                type="password"
                value={formData.clientKey}
                onChange={(e) => setFormData({...formData, clientKey: e.target.value})}
                placeholder="ptlc_..."
                className="bg-black/50 border-white/10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Node ID</Label>
                <Input 
                  value={formData.defaultNodeId}
                  onChange={(e) => setFormData({...formData, defaultNodeId: e.target.value})}
                  placeholder="1"
                  className="bg-black/50 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Default Egg ID</Label>
                <Input 
                  value={formData.defaultEggId}
                  onChange={(e) => setFormData({...formData, defaultEggId: e.target.value})}
                  placeholder="1"
                  className="bg-black/50 border-white/10"
                />
              </div>
            </div>

            <Button onClick={handleSave} disabled={updateSettings.isPending} className="w-full mt-4 btn-glow bg-primary hover:bg-primary/90 uppercase tracking-widest font-bold">
              {updateSettings.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="glass-panel border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="uppercase tracking-tight">Live Nodes</CardTitle>
                <CardDescription>Available allocation targets</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => fetchNodes()} disabled={loadingNodes} className="border-primary/50 hover:bg-primary/20 text-primary">
                {loadingNodes ? "Fetching..." : "Fetch Nodes"}
              </Button>
            </CardHeader>
            <CardContent>
              {nodes && nodes.length > 0 ? (
                <div className="space-y-3 mt-4">
                  {nodes.map(node => (
                    <div key={node.id} className="p-3 bg-black/40 border border-white/5 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Server className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-bold text-white text-sm">{node.name} <span className="text-muted-foreground font-normal ml-2">ID: {node.id}</span></div>
                          <div className="text-xs text-muted-foreground">{node.fqdn}</div>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <div className="text-white">Mem: {Math.round(node.memory / 1024)}GB</div>
                        <div className="text-white">Disk: {Math.round(node.disk / 1024)}GB</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground text-sm border border-dashed border-white/10 rounded-lg mt-4">
                  Click fetch to load nodes from panel
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="uppercase tracking-tight">Available Eggs</CardTitle>
                <CardDescription>Game server configurations</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => fetchEggs()} disabled={loadingEggs} className="border-primary/50 hover:bg-primary/20 text-primary">
                {loadingEggs ? "Fetching..." : "Fetch Eggs"}
              </Button>
            </CardHeader>
            <CardContent>
              {eggs && eggs.length > 0 ? (
                <div className="space-y-3 mt-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {eggs.map(egg => (
                    <div key={egg.id} className="p-3 bg-black/40 border border-white/5 rounded-lg">
                      <div className="font-bold text-white text-sm flex items-center justify-between">
                        {egg.name} <span className="text-muted-foreground font-normal bg-white/5 px-2 py-0.5 rounded text-xs">ID: {egg.id}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 truncate">{egg.description}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground text-sm border border-dashed border-white/10 rounded-lg mt-4">
                  Click fetch to load eggs from panel
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
