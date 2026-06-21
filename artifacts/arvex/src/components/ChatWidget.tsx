import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Loader2, MessageSquare, Minimize2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSendChatMessage } from "@workspace/api-client-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Message = {
  role: "assistant",
  content: "Hey! 👋 I'm **ArveX AI** — your 24/7 support assistant. Ask me anything about our hosting plans, pricing, features, or how to get started!",
};

function formatMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const mutation = useSendChatMessage();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mutation.isPending]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const send = () => {
    const text = input.trim();
    if (!text || mutation.isPending) return;
    setInput("");

    const history = messages
      .filter(m => m.role !== "assistant" || m !== WELCOME)
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }));

    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);

    mutation.mutate(
      { data: { message: text, history } },
      {
        onSuccess: (data) => {
          const reply = (data as { reply: string }).reply;
          setMessages(prev => [...prev, { role: "assistant", content: reply }]);
        },
        onError: () => {
          setMessages(prev => [...prev, {
            role: "assistant",
            content: "Sorry, I ran into an issue. Please try again or email support@arvexhosting.com.",
          }]);
        },
      }
    );
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const clearChat = () => setMessages([WELCOME]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[360px] max-h-[560px] flex flex-col rounded-2xl border border-white/10 bg-[#0c0c14]/95 backdrop-blur-2xl shadow-[0_0_60px_rgba(124,58,237,0.3)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-primary/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">ArveX AI</p>
                  <p className="text-[10px] text-green-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
                    Online — Always Here
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={clearChat} title="Clear chat" className="p-1.5 rounded-md text-muted-foreground hover:text-white hover:bg-white/10 transition-colors">
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-md text-muted-foreground hover:text-white hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin" style={{ maxHeight: 420 }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${msg.role === "assistant" ? "bg-primary/20 border border-primary/40" : "bg-white/10 border border-white/20"}`}>
                    {msg.role === "assistant" ? <Bot className="w-3 h-3 text-primary" /> : <User className="w-3 h-3 text-white" />}
                  </div>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${msg.role === "assistant" ? "bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm" : "bg-primary text-white rounded-tr-sm"}`}>
                    {msg.role === "assistant" ? (
                      <span dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }} />
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}

              {mutation.isPending && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3 text-primary" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 bg-primary/60 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {["Cheapest plan?", "DDoS protection?", "How fast is setup?"].map(q => (
                  <button key={q} onClick={() => { setInput(q); setTimeout(send, 50); }}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-primary/30 text-primary/80 hover:bg-primary/10 hover:text-primary transition-colors font-medium">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-white/10 flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything about hosting..."
                disabled={mutation.isPending}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:bg-white/8 transition-all"
              />
              <button
                onClick={send}
                disabled={!input.trim() || mutation.isPending}
                className="w-9 h-9 rounded-xl bg-primary hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all shrink-0"
              >
                {mutation.isPending ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 rounded-full bg-primary shadow-[0_0_30px_rgba(124,58,237,0.6)] flex items-center justify-center border border-primary/50 transition-all hover:shadow-[0_0_40px_rgba(124,58,237,0.8)]"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageSquare className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full animate-pulse" />
        )}
      </motion.button>
    </div>
  );
}
