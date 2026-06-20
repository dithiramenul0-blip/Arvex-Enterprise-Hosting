import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Edit2, Save, Eye, Send, RefreshCw } from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  trigger: string;
  variables: string[];
  lastEdited: string;
}

const b = (...lines: string[]) => lines.join("\n");

const TEMPLATES: EmailTemplate[] = [
  {
    id: "welcome",
    name: "Welcome Email",
    subject: "Welcome to ArveX Hosting, {{name}}!",
    body: b(
      "Hi {{name}},",
      "",
      "Welcome to ArveX Hosting — the #1 choice for enterprise hosting.",
      "",
      "Your account is now active. You can log in at: https://arvex.host/login",
      "",
      "Get started:",
      "- Choose a plan: https://arvex.host/vps",
      "- Open a support ticket: https://arvex.host/client/tickets",
      "- View your dashboard: https://arvex.host/client",
      "",
      "If you have any questions, our 24/7 support team is here to help.",
      "",
      "— The ArveX Team"
    ),
    trigger: "New user registration",
    variables: ["{{name}}", "{{email}}", "{{date}}"],
    lastEdited: "2025-06-01",
  },
  {
    id: "invoice",
    name: "Invoice Created",
    subject: "Invoice #{{invoice_id}} — {{amount}} Due",
    body: b(
      "Hi {{name}},",
      "",
      "Your invoice #{{invoice_id}} for {{amount}} has been generated.",
      "",
      "Service: {{service}}",
      "Due Date: {{due_date}}",
      "Pay now: https://arvex.host/client/invoices/{{invoice_id}}",
      "",
      "Payment methods: PayPal, Stripe, Crypto, Bank Transfer.",
      "",
      "— ArveX Billing"
    ),
    trigger: "Invoice generated",
    variables: ["{{name}}", "{{invoice_id}}", "{{amount}}", "{{service}}", "{{due_date}}"],
    lastEdited: "2025-06-05",
  },
  {
    id: "paid",
    name: "Payment Confirmed",
    subject: "Payment Received — Invoice #{{invoice_id}}",
    body: b(
      "Hi {{name}},",
      "",
      "We've received your payment of {{amount}} for Invoice #{{invoice_id}}.",
      "",
      "Your service {{service}} is now active and ready to use.",
      "Access your control panel: https://arvex.host/client",
      "",
      "Receipt: https://arvex.host/client/invoices/{{invoice_id}}",
      "",
      "Thank you for choosing ArveX!",
      "",
      "— ArveX Billing"
    ),
    trigger: "Payment received",
    variables: ["{{name}}", "{{invoice_id}}", "{{amount}}", "{{service}}"],
    lastEdited: "2025-06-05",
  },
  {
    id: "suspend",
    name: "Service Suspended",
    subject: "Service Suspended — Action Required",
    body: b(
      "Hi {{name}},",
      "",
      "Your service {{service}} has been suspended due to an unpaid invoice.",
      "",
      "Invoice #{{invoice_id}} of {{amount}} is overdue.",
      "",
      "To restore your service, please pay your invoice:",
      "https://arvex.host/client/invoices/{{invoice_id}}",
      "",
      "Your data is safe and will be preserved for 14 days.",
      "",
      "— ArveX Billing"
    ),
    trigger: "Service suspension",
    variables: ["{{name}}", "{{service}}", "{{invoice_id}}", "{{amount}}"],
    lastEdited: "2025-06-08",
  },
  {
    id: "ticket_reply",
    name: "Ticket Reply",
    subject: "Re: Ticket #{{ticket_id}} — {{ticket_subject}}",
    body: b(
      "Hi {{name}},",
      "",
      "Your support ticket #{{ticket_id}} has received a reply from our team.",
      "",
      "Ticket: {{ticket_subject}}",
      "Reply: {{reply_preview}}",
      "",
      "View full conversation: https://arvex.host/client/tickets/{{ticket_id}}",
      "",
      "— ArveX Support"
    ),
    trigger: "Admin replies to ticket",
    variables: ["{{name}}", "{{ticket_id}}", "{{ticket_subject}}", "{{reply_preview}}"],
    lastEdited: "2025-06-10",
  },
  {
    id: "password_reset",
    name: "Password Reset",
    subject: "Reset Your ArveX Password",
    body: b(
      "Hi {{name}},",
      "",
      "We received a request to reset your password.",
      "",
      "Click the link below to set a new password (valid for 1 hour):",
      "https://arvex.host/reset-password?token={{token}}",
      "",
      "If you did not request this, ignore this email — your account is safe.",
      "",
      "— ArveX Security"
    ),
    trigger: "Password reset request",
    variables: ["{{name}}", "{{token}}", "{{expires}}"],
    lastEdited: "2025-06-01",
  },
];

export default function AdminEmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(TEMPLATES);
  const [selected, setSelected] = useState<EmailTemplate | null>(null);
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    if (!selected) return;
    setTemplates(prev => prev.map(t => t.id === selected.id ? { ...selected, lastEdited: new Date().toISOString().split("T")[0] } : t));
    setEditing(false);
    toast({ title: "Template saved!" });
  };

  const handleSendTest = () => {
    toast({ title: "Test email sent to admin@arvex.host" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Email Templates</h1>
        <p className="text-muted-foreground mt-1">Edit transactional email templates for all system events.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List */}
        <div className="space-y-2">
          {templates.map((t, i) => (
            <motion.button
              key={t.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => { setSelected(t); setEditing(false); setPreview(false); }}
              className={`w-full glass-panel p-4 rounded-xl text-left transition-all ${selected?.id === t.id ? "border-glow" : "hover:border-primary/30"}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="text-white font-bold text-sm truncate">{t.name}</div>
                  <div className="text-muted-foreground text-xs truncate">{t.trigger}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="glass-panel p-8 rounded-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-white uppercase">{selected.name}</h3>
                  <p className="text-muted-foreground text-xs mt-1">Trigger: {selected.trigger} · Last edited: {selected.lastEdited}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setPreview(!preview)} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-all ${preview ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground hover:text-white"}`}>
                    <Eye className="w-3.5 h-3.5" /> {preview ? "Edit" : "Preview"}
                  </button>
                  {!editing ? (
                    <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-white/5 text-muted-foreground hover:text-white transition-colors">
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                  ) : (
                    <button onClick={handleSave} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-primary text-white transition-colors">
                      <Save className="w-3.5 h-3.5" /> Save
                    </button>
                  )}
                  <button onClick={handleSendTest} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-white/5 text-muted-foreground hover:text-white transition-colors">
                    <Send className="w-3.5 h-3.5" /> Test
                  </button>
                </div>
              </div>

              {/* Variables */}
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Available Variables</div>
                <div className="flex flex-wrap gap-2">
                  {selected.variables.map(v => (
                    <code key={v} className="text-xs text-primary bg-primary/10 px-2 py-1 rounded font-mono">{v}</code>
                  ))}
                </div>
              </div>

              {preview ? (
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Subject Preview</div>
                  <div className="glass-panel p-3 rounded-lg text-sm text-white font-medium mb-4">{selected.subject}</div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Body Preview</div>
                  <div className="glass-panel p-6 rounded-xl">
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">{selected.body}</pre>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Subject Line</label>
                    <Input
                      value={selected.subject}
                      disabled={!editing}
                      onChange={e => setSelected(s => s ? { ...s, subject: e.target.value } : s)}
                      className="bg-black/50 border-white/10 text-white disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Email Body</label>
                    <Textarea
                      value={selected.body}
                      disabled={!editing}
                      onChange={e => setSelected(s => s ? { ...s, body: e.target.value } : s)}
                      className="bg-black/50 border-white/10 text-white min-h-[300px] font-mono text-sm disabled:opacity-60"
                    />
                  </div>
                </>
              )}

              {editing && (
                <div className="flex gap-3">
                  <Button onClick={handleSave} className="btn-glow bg-primary hover:bg-primary/90 text-white font-bold">
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => { setSelected(templates.find(t => t.id === selected.id)!); setEditing(false); }} className="border-white/10 text-muted-foreground">
                    <RefreshCw className="w-4 h-4 mr-2" /> Discard
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl text-center flex flex-col items-center justify-center h-full">
              <Mail className="w-12 h-12 text-primary/30 mb-4" />
              <p className="text-muted-foreground font-medium">Select a template to view or edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
