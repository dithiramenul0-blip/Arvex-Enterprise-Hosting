import { useState } from "react";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Server } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login: setAuthToken } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (data) => {
        setAuthToken(data.token);
        toast({ title: "Welcome back", description: "Login successful." });
        setLocation(data.user.role === "admin" ? "/admin" : "/client");
      },
      onError: (error: any) => {
        toast({ 
          variant: "destructive", 
          title: "Login Failed", 
          description: error?.error || "Invalid credentials." 
        });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ data: { email, password } });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,0,0,0.15),transparent_50%)] pointer-events-none" />
      
      <PageTransition className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center mb-6">
            <Server className="h-8 w-8 text-primary" />
            <span className="font-bold text-3xl tracking-tight text-white glow-text">ArveX</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Sign in to your account</h1>
          <p className="text-muted-foreground">Manage your enterprise infrastructure</p>
        </div>

        <div className="glass-panel p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/50 border-white/10 focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/80">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/50 border-white/10 focus:border-primary"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-lg glow-border"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:text-primary/80 font-medium">
              Register now
            </Link>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
