import { Router } from "express";
import OpenAI from "openai";

const router = Router();

router.post("/chat", async (req, res) => {
  const { message, history = [] } = req.body as {
    message: string;
    history?: Array<{ role: "user" | "assistant"; content: string }>;
  };

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "message is required" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.json({
      reply: "Hi! I'm the ArveX AI assistant. I'm not fully configured yet — but our human support team is available 24/7! Visit your client portal to open a ticket, or email us at support@arvexhosting.com.",
      configured: false,
    });
    return;
  }

  try {
    const openai = new OpenAI({ apiKey });

    const systemPrompt = `You are the AI support assistant for ArveX Hosting™, a premium enterprise hosting company. Be friendly, concise, and helpful.

SERVICES & PRICING:
- VPS Hosting: Root access, NVMe SSD, DDoS protection, instant deploy. From $4.99/mo
- Minecraft Hosting: Ultra-low latency, mod support, auto-backups. From $2.99/mo
- Bot Hosting: 24/7 uptime for Discord bots & Node.js projects. From $1.99/mo
- VDS Hosting: Dedicated CPU cores, guaranteed RAM. From $9.99/mo
- Web Hosting: cPanel, unlimited subdomains, 1-click WordPress. From $2.49/mo
- V2Ray Proxy: VMess, VLess, Shadowsocks proxy. From $3.99/mo

KEY FEATURES:
- 99.99% Uptime SLA
- 10 Tbps DDoS Protection (always-on, free on all plans)
- NVMe SSD storage / RAID-10 arrays
- 24/7 human support (no bots, just experts)
- Instant deployment under 60 seconds
- 3-day money-back guarantee
- 12+ global datacenters: US, UK, Germany, Netherlands, Singapore, Japan, Australia, Brazil, Canada, France, India
- Pterodactyl panel for game servers, Proxmox for VPS/VDS, cPanel for web hosting

BILLING:
- Accepts Stripe (credit/debit card) and PayPal
- Monthly billing, no contracts, no setup fees
- Cancel anytime from dashboard

CONTACT:
- Support email: support@arvexhosting.com
- Billing email: billing@arvexhosting.com
- Discord community available
- Submit tickets from /client dashboard

GUIDELINES:
- Help users choose the right plan based on their needs
- Guide users to relevant pages: /vps, /minecraft, /bot-hosting, /vds, /web-hosting, /v2ray, /register, /login, /client
- For billing issues: direct to billing@arvexhosting.com
- For technical issues: open a ticket at /client/tickets
- Keep replies under 150 words unless detail is needed
- Never mention competitor products
- Always be positive and professional`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...history.map(h => ({ role: h.role as "user" | "assistant", content: h.content })),
      { role: "user" as const, content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 400,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content ?? "I couldn't process that. Please try again or contact support@arvexhosting.com.";
    res.json({ reply, configured: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI error";
    req.log?.error({ err }, "Chat error");
    res.status(400).json({ error: msg });
  }
});

export default router;
