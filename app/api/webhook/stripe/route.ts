import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";
import { prisma } from "@/utils/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;
  try {
    if (process.env.STRIPE_WEBHOOK_SECRET && signature) {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      event = JSON.parse(body);
    }
  } catch (err: unknown) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId =
      (session.metadata && session.metadata.orderId) ||
      session.client_reference_id;

    if (orderId) {
      try {
        await prisma.order.update({
          where: { id: orderId },
          data: { paid: true },
        });
        console.log(`[Stripe Webhook]: Order #${orderId} marked as paid`);
      } catch (e) {
        console.error(`[Stripe Webhook Error] updating order ${orderId}:`, e);
      }
    }
  }

  return NextResponse.json({ received: true });
}
