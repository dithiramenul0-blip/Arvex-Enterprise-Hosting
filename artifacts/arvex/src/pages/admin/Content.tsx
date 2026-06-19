import { useState, useEffect, useRef } from "react";
import { useGetContent, getGetContentQueryKey, useUpdateContent } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AdminContent() {
  const [slug, setSlug] = useState("terms");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: page } = useGetContent(slug, {
    query: {
      enabled: !!slug,
      queryKey: getGetContentQueryKey(slug)
    }
  });

  const initializedForSlug = useRef<string | null>(null);

  useEffect(() => {
    if (page && initializedForSlug.current !== slug) {
      initializedForSlug.current = slug;
      setTitle(page.title);
      setContent(page.content);
    }
  }, [page, slug]);

  const handleSlugChange = (newSlug: string) => {
    initializedForSlug.current = null;
    setSlug(newSlug);
  };

  const updateMutation = useUpdateContent({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetContentQueryKey(slug) });
        toast({ title: "Content updated", description: "The page content has been saved." });
      }
    }
  });

  const handleSave = () => {
    updateMutation.mutate({ slug, data: { title, content } });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-white">Content CMS</h1>

      <div className="flex gap-4 items-center mb-6">
        <label className="text-white font-medium">Select Page:</label>
        <Select value={slug} onValueChange={handleSlugChange}>
          <SelectTrigger className="w-[200px] bg-black/50 border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="terms">Terms of Service</SelectItem>
            <SelectItem value="privacy">Privacy Policy</SelectItem>
            <SelectItem value="refund">Refund Policy</SelectItem>
            <SelectItem value="sla">SLA Agreement</SelectItem>
            <SelectItem value="aup">Acceptable Use Policy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="glass-panel border-white/10">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Page Title</label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="bg-black/50 border-white/10"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Content (Markdown / HTML)</label>
            <Textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              className="min-h-[400px] font-mono text-sm bg-black/50 border-white/10"
            />
          </div>

          <Button 
            onClick={handleSave} 
            className="w-full bg-primary hover:bg-primary/90 text-white"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Content"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
