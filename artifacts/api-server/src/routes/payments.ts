import { Router } from "express";
import { db, billingSettingsTable, plansTable, ordersTable, servicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, type AuthRequest } from "../middlewares/authenticate.js";
import { autoProvisionService } from "../lib/provisioner.js";

const router = Router();

async function getBillingSetting(key: string): Promise<string | null> {
  const [row] = await db.select().from(billingSettingsTable).where(eq(billingSettingsTable.key, key)).limit(1);
  return row?.value ?? null;
}

async function createOrderAndService(userId: number, planId: number, paymentMethod: string) {
  const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, planId)).limit(1);
  if (!plan) throw new Error("Plan not found");
  const price = parseFloat(plan.price as unknown as string);

  const [order] = await db.insert(ordersTable).values({
    userId,
    planId,
    status: "active",
    totalPrice: price.toString(),
    paymentMethod,
  }).returning();

  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);
  const [service] = await db.insert(servicesTable).values({
    userId,
    planId,
    status: "active",
    provisionStatus: "pending",
    expiresAt,
  }).returning();

  setImmediate(() => { autoProvisionService(service.id).catch(() => {}); });
  return { order, plan, price };
}

// ─── Stripe ────────────────────────────────────────────────────────────────
router.post("/payments/stripe/create-session", authenticate, async (req: AuthRequest, res) => {
  const { planId } = req.body as { planId: number };
  if (!planId) { res.status(400).json({ error: "planId required" }); return; }

  const stripeKey = await getBillingSetting("stripe_secret_key");
  const stripeEnabled = await getBillingSetting("stripe_enabled");

  if (!stripeKey || stripeEnabled !== "true") {
    res.status(400).json({ error: "Stripe is not configured or disabled. Please contact admin." });
    return;
  }

  const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, planId)).limit(1);
  if (!plan) { res.status(404).json({ error: "Plan not found" }); return; }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey, { apiVersion: "2026-05-27.dahlia" });

    const price = parseFloat(plan.price as unknown as string);
    const returnBase = process.env.REPLIT_DOMAINS
      ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
      : "http://localhost";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: plan.name, description: plan.category ?? undefined },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${returnBase}/dashboard?payment=success&planId=${planId}`,
      cancel_url: `${returnBase}/dashboard?payment=cancelled`,
      metadata: { planId: planId.toString(), userId: req.userId!.toString() },
    });

    res.json({ url: session.url! });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Stripe error";
    res.status(400).json({ error: msg });
  }
});

router.post("/payments/stripe/webhook", async (req, res) => {
  const stripeKey = await getBillingSetting("stripe_secret_key");
  const webhookSecret = await getBillingSetting("stripe_webhook_secret");

  if (!stripeKey) { res.status(400).json({ error: "Stripe not configured" }); return; }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey, { apiVersion: "2026-05-27.dahlia" });

    let event;
    if (webhookSecret) {
      const sig = req.headers["stripe-signature"] as string;
      event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
    } else {
      event = req.body;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as { metadata?: { planId?: string; userId?: string } };
      const planId = parseInt(session.metadata?.planId ?? "0");
      const userId = parseInt(session.metadata?.userId ?? "0");
      if (planId && userId) {
        await createOrderAndService(userId, planId, "stripe");
      }
    }

    res.json({ message: "ok" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Webhook error";
    res.status(400).json({ error: msg });
  }
});

// ─── PayPal ───────────────────────────────────────────────────────────────
async function getPaypalAccessToken(clientId: string, clientSecret: string, mode: string): Promise<string> {
  const baseUrl = mode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const resp = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: { "Authorization": `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const data = await resp.json() as { access_token?: string };
  if (!data.access_token) throw new Error("Failed to get PayPal access token");
  return data.access_token;
}

router.post("/payments/paypal/create-order", authenticate, async (req: AuthRequest, res) => {
  const { planId } = req.body as { planId: number };
  if (!planId) { res.status(400).json({ error: "planId required" }); return; }

  const clientId = await getBillingSetting("paypal_client_id");
  const clientSecret = await getBillingSetting("paypal_client_secret");
  const paypalEnabled = await getBillingSetting("paypal_enabled");
  const paypalMode = (await getBillingSetting("paypal_mode")) ?? "sandbox";

  if (!clientId || !clientSecret || paypalEnabled !== "true") {
    res.status(400).json({ error: "PayPal is not configured or disabled. Please contact admin." });
    return;
  }

  const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, planId)).limit(1);
  if (!plan) { res.status(404).json({ error: "Plan not found" }); return; }

  try {
    const baseUrl = paypalMode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
    const accessToken = await getPaypalAccessToken(clientId, clientSecret, paypalMode);
    const price = parseFloat(plan.price as unknown as string);

    const returnBase = process.env.REPLIT_DOMAINS
      ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
      : "http://localhost";

    const orderResp = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          amount: { currency_code: "USD", value: price.toFixed(2) },
          description: plan.name,
          custom_id: `${req.userId}:${planId}`,
        }],
        application_context: {
          return_url: `${returnBase}/dashboard?payment=success&planId=${planId}`,
          cancel_url: `${returnBase}/dashboard?payment=cancelled`,
        },
      }),
    });

    const order = await orderResp.json() as {
      id?: string;
      links?: Array<{ rel: string; href: string }>;
    };

    if (!order.id) throw new Error("PayPal order creation failed");

    const approvalLink = order.links?.find(l => l.rel === "approve")?.href ?? "";
    res.json({ id: order.id, approvalUrl: approvalLink });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "PayPal error";
    res.status(400).json({ error: msg });
  }
});

router.post("/payments/paypal/capture/:orderId", authenticate, async (req: AuthRequest, res) => {
  const { orderId } = req.params as { orderId: string };

  const clientId = await getBillingSetting("paypal_client_id");
  const clientSecret = await getBillingSetting("paypal_client_secret");
  const paypalMode = (await getBillingSetting("paypal_mode")) ?? "sandbox";

  if (!clientId || !clientSecret) {
    res.status(400).json({ error: "PayPal not configured" });
    return;
  }

  try {
    const baseUrl = paypalMode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
    const accessToken = await getPaypalAccessToken(clientId, clientSecret, paypalMode);

    const captureResp = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json" },
    });

    const capture = await captureResp.json() as {
      status?: string;
      purchase_units?: Array<{ payments?: { captures?: Array<{ custom_id?: string }> } }>;
    };

    if (capture.status === "COMPLETED") {
      const customId = capture.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id ?? "";
      const [userIdStr, planIdStr] = customId.split(":");
      const userId = parseInt(userIdStr ?? "0");
      const planId = parseInt(planIdStr ?? "0");
      if (userId && planId) {
        await createOrderAndService(userId, planId, "paypal");
      }
      res.json({ message: "Payment captured successfully" });
    } else {
      res.status(400).json({ error: "Payment not completed" });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "PayPal capture error";
    res.status(400).json({ error: msg });
  }
});

export default router;
