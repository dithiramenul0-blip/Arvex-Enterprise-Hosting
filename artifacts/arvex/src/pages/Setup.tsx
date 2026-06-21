import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Shield, CheckCircle2, LogOut, AlertTriangle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Setup() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error" | "already">("idle");
  const [message, setMessage] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen bg-[#05050b] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white mb-2">Login Required</h1>
            <p className="text-muted-foreground text-sm">First log in to your account, then come back to this page.</p>
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest" onClick={() => setLocation("/login")}>
            Go to Login <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="min-h-screen bg-[#05050b] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white mb-2">You're Now Admin! 🎉</h1>
            <p className="text-muted-foreground text-sm mb-1">Log out and log back in — then everything will work.</p>
            <p className="text-xs text-muted-foreground/50">Your account: <span className="text-white font-bold">{user.email}</span></p>
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest"
            onClick={() => { logout(); setLocation("/login"); }}
          >
            <LogOut className="w-4 h-4 mr-2" /> Log Out Now
          </Button>
        </div>
      </div>
    );
  }

  if (status === "already") {
    return (
      <div className="min-h-screen bg-[#05050b] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white mb-2">Admin Already Exists</h1>
            <p className="text-muted-foreground text-sm mb-1">{message}</p>
            <p className="text-xs text-muted-foreground/50 mt-2">If that's you, just <strong className="text-white">log out and log back in</strong> — that's all you need.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 border-white/10 text-muted-foreground hover:text-white" onClick={() => setLocation("/login")}>
              Login Page
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-white font-black" onClick={() => { logout(); setLocation("/login"); }}>
              <LogOut className="w-4 h-4 mr-2" /> Logout & Relogin
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSetup = async () => {
    setStatus("loading");
    try {
      const token = localStorage.getItem("arvex_token");
      const res = await fetch("/api/setup-admin", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json() as { message?: string; error?: string };
      if (res.ok) {
        setStatus("done");
      } else if (res.status === 400 && data.error?.includes("already")) {
        setStatus("already");
        setMessage(data.error);
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Network error — check your internet connection.");
    }
  };

  return (
    <div className="min-h-screen bg-[#05050b] flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(124,58,237,0.2)]">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Admin Setup</h1>
            <p className="text-muted-foreground text-sm">One click to make your account the admin.</p>
          </div>
        </div>

        {/* Account Card */}
        <div className="rounded-2xl border border-white/8 bg-white/2 p-5">
          <div className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest mb-3">Logged in as</div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div>
              <div className="font-black text-white">{user.firstName} {user.lastName}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        </div>

        {/* Action */}
        {status === "error" && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            {message}
          </div>
        )}

        <Button
          className="w-full h-14 text-base font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] disabled:opacity-60"
          onClick={handleSetup}
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Making You Admin...</>
          ) : (
            <><Shield className="w-5 h-5 mr-2" /> Make Me Admin</>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground/40">
          This only works if no admin exists yet. After clicking, you'll log out and log back in.
        </p>
      </div>
    </div>
  );
}
