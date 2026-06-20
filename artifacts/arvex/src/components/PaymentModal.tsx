import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCreateStripeSession, useCreatePaypalOrder, useCapturePaypalOrder } from "@workspace/api-client-react";
import { X, CreditCard, Loader2, CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";

interface PaymentModalProps {
  planId: number;
  planName: string;
  planPrice: number;
  onClose: () => void;
}

export default function PaymentModal({ planId, planName, planPrice, onClose }: PaymentModalProps) {
  const [step, setStep] = useState<"select" | "processing" | "paypal_redirect" | "success" | "error">("select");
  const [method, setMethod] = useState<"stripe" | "paypal" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const { toast } = useToast();

  const stripeMutation = useCreateStripeSession({
    mutation: {
      onSuccess: (data) => {
        window.location.href = data.url;
      },
      onError: (err) => {
        const data = err.data as { error?: string } | null;
        setErrorMsg(data?.error ?? err.message ?? "Stripe error. Ensure Stripe is configured in admin.");
        setStep("error");
      },
    },
  });

  const paypalMutation = useCreatePaypalOrder({
    mutation: {
      onSuccess: (data) => {
        setStep("paypal_redirect");
        setTimeout(() => {
          window.open(data.approvalUrl, "_blank");
        }, 500);
      },
      onError: (err) => {
        const data = err.data as { error?: string } | null;
        setErrorMsg(data?.error ?? err.message ?? "PayPal error. Ensure PayPal is configured in admin.");
        setStep("error");
      },
    },
  });

  const handleStripe = () => {
    setMethod("stripe");
    setStep("processing");
    stripeMutation.mutate({ data: { planId } });
  };

  const handlePayPal = () => {
    setMethod("paypal");
    setStep("processing");
    paypalMutation.mutate({ data: { planId } });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative glass-panel rounded-2xl p-8 w-full max-w-md border border-white/10 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {step === "select" && (
            <div>
              <div className="mb-6">
                <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Checkout</div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">{planName}</h2>
                <div className="text-3xl font-black text-primary mt-2">${planPrice.toFixed(2)}<span className="text-sm text-muted-foreground font-normal">/mo</span></div>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Select Payment Method</p>

                <button
                  onClick={handleStripe}
                  className="w-full flex items-center gap-4 p-5 rounded-xl bg-black/40 border border-white/10 hover:border-primary/60 hover:bg-primary/5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#635BFF]/20 border border-[#635BFF]/40 flex items-center justify-center text-2xl font-black text-[#635BFF] shrink-0 group-hover:bg-[#635BFF]/30 transition-colors">
                    S
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold">Pay with Stripe</div>
                    <div className="text-muted-foreground text-xs">Credit/Debit Card — Visa, Mastercard, Amex</div>
                  </div>
                  <CreditCard className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                </button>

                <button
                  onClick={handlePayPal}
                  className="w-full flex items-center gap-4 p-5 rounded-xl bg-black/40 border border-white/10 hover:border-[#0070BA]/60 hover:bg-[#0070BA]/5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0070BA]/20 border border-[#0070BA]/40 flex items-center justify-center text-xl font-black text-[#0070BA] shrink-0 group-hover:bg-[#0070BA]/30 transition-colors">
                    P
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold">Pay with PayPal</div>
                    <div className="text-muted-foreground text-xs">PayPal balance, bank account, or card</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-[#0070BA] transition-colors" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-white/5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                Secure checkout — SSL encrypted — 3-day money-back guarantee
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="text-center py-8">
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-black text-white uppercase">
                {method === "stripe" ? "Redirecting to Stripe..." : "Creating PayPal Order..."}
              </h3>
              <p className="text-muted-foreground text-sm mt-2 font-medium">Please wait, do not close this window.</p>
            </div>
          )}

          {step === "paypal_redirect" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#0070BA]/20 border border-[#0070BA]/40 flex items-center justify-center mx-auto mb-4 text-3xl font-black text-[#0070BA]">P</div>
              <h3 className="text-xl font-black text-white uppercase mb-2">PayPal Window Opened</h3>
              <p className="text-muted-foreground text-sm mb-6 font-medium">Complete your payment in the PayPal window. Your service will activate automatically after payment.</p>
              <Button onClick={onClose} className="bg-primary hover:bg-primary/90 text-white font-bold">
                Done — Close This Window
              </Button>
            </div>
          )}

          {step === "error" && (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-black text-white uppercase mb-2">Payment Failed</h3>
              <p className="text-muted-foreground text-sm mb-6 font-medium">{errorMsg}</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("select")} className="flex-1 border-white/10 text-white hover:bg-white/5">
                  Try Again
                </Button>
                <Button onClick={onClose} className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold">
                  Close
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
