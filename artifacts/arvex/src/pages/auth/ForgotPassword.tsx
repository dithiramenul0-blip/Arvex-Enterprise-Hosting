import { useState } from "react";
import { useForgotPassword } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Server, ArrowLeft } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const forgotMutation = useForgotPassword({
    mutation: {
      onSuccess: () => {
        setSubmitted(true);
        toast({ title: "Email sent", description: "If an account exists, a reset link was sent." });
      },
      onError: (error: any) => {
        toast({ variant: "destructive", title: "Error", description: error?.error || "Failed to process request." });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotMutation.mutate({ data: { email } });
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
          <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-muted-foreground">Enter your email to receive a reset link</p>
        </div>

        <div className="glass-panel p-8 rounded-2xl">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Check your email</h3>
              <p className="text-muted-foreground">We've sent instructions to reset your password to {email}</p>
              <Link href="/login">
                <Button className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white">
                  Return to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-black/50 border-white/10"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-lg glow-border"
                disabled={forgotMutation.isPending}
              >
                {forgotMutation.isPending ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
