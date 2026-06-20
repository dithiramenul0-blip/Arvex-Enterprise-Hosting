import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Folder, File, Image, FileText, Upload, Download, Trash2,
  Plus, Search, ChevronRight, HardDrive, RefreshCw, Eye
} from "lucide-react";

interface FsItem {
  id: number;
  name: string;
  type: "folder" | "file";
  ext?: string;
  size?: string;
  modified: string;
  url?: string;
}

const ROOT_ITEMS: FsItem[] = [
  { id: 1, name: "uploads", type: "folder", modified: "2025-06-18" },
  { id: 2, name: "logos", type: "folder", modified: "2025-06-15" },
  { id: 3, name: "partner-logos", type: "folder", modified: "2025-06-12" },
  { id: 4, name: "og-home.jpg", type: "file", ext: "jpg", size: "148 KB", modified: "2025-06-10", url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400" },
  { id: 5, name: "og-vps.jpg", type: "file", ext: "jpg", size: "132 KB", modified: "2025-06-10", url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400" },
  { id: 6, name: "logo-dark.svg", type: "file", ext: "svg", size: "8 KB", modified: "2025-05-20" },
  { id: 7, name: "favicon.ico", type: "file", ext: "ico", size: "4 KB", modified: "2025-05-20" },
  { id: 8, name: "sitemap.xml", type: "file", ext: "xml", size: "12 KB", modified: "2025-06-20" },
  { id: 9, name: "robots.txt", type: "file", ext: "txt", size: "0.3 KB", modified: "2025-06-01" },
  { id: 10, name: "terms.md", type: "file", ext: "md", size: "18 KB", modified: "2025-05-15" },
];

function FileIcon({ ext, type }: { ext?: string; type: string }) {
  if (type === "folder") return <Folder className="w-8 h-8 text-yellow-400" />;
  if (ext === "jpg" || ext === "png" || ext === "svg" || ext === "ico" || ext === "webp") return <Image className="w-8 h-8 text-blue-400" />;
  if (ext === "txt" || ext === "md") return <FileText className="w-8 h-8 text-green-400" />;
  return <File className="w-8 h-8 text-muted-foreground" />;
}

export default function AdminFileManager() {
  const [items, setItems] = useState<FsItem[]>(ROOT_ITEMS);
  const [selected, setSelected] = useState<FsItem | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toast } = useToast();

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  const folders = filtered.filter(i => i.type === "folder");
  const files = filtered.filter(i => i.type === "file");

  const remove = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
    if (selected?.id === id) setSelected(null);
    toast({ title: "Item deleted." });
  };

  const totalSize = "2.4 GB";
  const usedPct = 24;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">File Manager</h1>
          <p className="text-muted-foreground mt-1">Manage uploaded assets, media, and static files.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 text-muted-foreground hover:text-white">
            <Plus className="w-4 h-4 mr-2" /> New Folder
          </Button>
          <Button className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold">
            <Upload className="w-4 h-4 mr-2" /> Upload Files
          </Button>
        </div>
      </div>

      {/* Storage Bar */}
      <div className="glass-panel p-6 rounded-2xl flex flex-wrap items-center gap-6">
        <HardDrive className="w-6 h-6 text-primary" />
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-white">Storage Used</span>
            <span className="text-sm text-muted-foreground">{totalSize} / 10 GB</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usedPct}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-primary to-violet-400 rounded-full"
            />
          </div>
        </div>
        <div className="text-2xl font-black text-white">{usedPct}%</div>
        <div className="flex items-center gap-3 ml-auto">
          <div className="flex rounded-xl overflow-hidden border border-white/10">
            {(["grid", "list"] as const).map(m => (
              <button key={m} onClick={() => setViewMode(m)}
                className={`px-3 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${viewMode === m ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}>
                {m}
              </button>
            ))}
          </div>
          <button className="text-muted-foreground hover:text-white transition-colors p-2">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button className="hover:text-white transition-colors font-bold">Root</button>
        <ChevronRight className="w-4 h-4" />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..." className="pl-10 bg-black/50 border-white/10 text-white" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File browser */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          {folders.length > 0 && (
            <div className="mb-6">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Folders</div>
              <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-4 gap-3" : "space-y-2"}>
                {folders.map(item => (
                  <button key={item.id} onClick={() => setSelected(item)}
                    className={`glass-panel p-4 rounded-xl text-left transition-all hover:border-primary/30 w-full ${selected?.id === item.id ? "border-glow" : ""}`}>
                    <Folder className="w-8 h-8 text-yellow-400 mb-2" />
                    <div className="text-white font-medium text-sm truncate">{item.name}</div>
                    <div className="text-muted-foreground text-xs">{item.modified}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {files.length > 0 && (
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Files</div>
              <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-4 gap-3" : "space-y-2"}>
                {files.map(item => (
                  <div key={item.id} onClick={() => setSelected(item)}
                    className={`glass-panel p-4 rounded-xl cursor-pointer transition-all hover:border-primary/30 relative group ${selected?.id === item.id ? "border-glow" : ""}`}>
                    {item.url ? (
                      <div className="w-full h-16 rounded-lg overflow-hidden mb-2 bg-black/30">
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="mb-2"><FileIcon ext={item.ext} type={item.type} /></div>
                    )}
                    <div className="text-white font-medium text-xs truncate">{item.name}</div>
                    <div className="text-muted-foreground text-[10px]">{item.size}</div>
                    <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                      <button onClick={e => { e.stopPropagation(); remove(item.id); }} className="w-6 h-6 rounded bg-black/60 flex items-center justify-center text-red-400 hover:bg-red-500/20">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">No files found.</div>
          )}
        </div>

        {/* Preview pane */}
        <div>
          {selected ? (
            <div className="glass-panel p-6 rounded-2xl space-y-4 sticky top-6">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Preview</div>
              {selected.url ? (
                <img src={selected.url} alt={selected.name} className="w-full rounded-xl object-cover" />
              ) : (
                <div className="flex items-center justify-center h-32 rounded-xl bg-black/30">
                  <FileIcon ext={selected.ext} type={selected.type} />
                </div>
              )}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="text-white font-medium truncate ml-2">{selected.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="text-white font-medium capitalize">{selected.type}</span></div>
                {selected.size && <div className="flex justify-between"><span className="text-muted-foreground">Size</span><span className="text-white font-medium">{selected.size}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Modified</span><span className="text-white font-medium">{selected.modified}</span></div>
              </div>
              <div className="flex gap-2">
                {selected.url && (
                  <Button variant="outline" size="sm" className="border-white/10 text-muted-foreground hover:text-white flex-1">
                    <Eye className="w-3.5 h-3.5 mr-1.5" /> View
                  </Button>
                )}
                <Button variant="outline" size="sm" className="border-white/10 text-muted-foreground hover:text-white flex-1">
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Download
                </Button>
                <button onClick={() => remove(selected.id)} className="text-muted-foreground hover:text-red-400 transition-colors p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl text-center flex flex-col items-center justify-center">
              <File className="w-12 h-12 text-primary/30 mb-4" />
              <p className="text-muted-foreground font-medium text-sm">Click a file to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
