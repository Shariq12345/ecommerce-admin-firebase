import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

export const POST = async (req: Request) => {
  const body = await req.text();

  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(", ");

  if (event.type === "checkout.session.completed") {
    if (session?.metadata?.orderId) {
      await updateDoc(
        doc(
          db,
          "stores",
          session?.metadata?.storeId,
          "orders",
          session?.metadata?.orderId
        ),
        {
          isPaid: true,
          address: addressString,
          phone: session?.customer_details?.phone,
          updatedAt: serverTimestamp(),
        }
      );
    }
  }

  return new Response(null, { status: 200 });
};
