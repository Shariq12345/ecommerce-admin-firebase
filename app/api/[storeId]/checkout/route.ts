import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/firebase";
import { Product } from "@/types/types";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(req: Request) {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { products, userId, cakeMessage, note } = await req.json();

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products.forEach((item: Product) => {
      line_items.push({
        quantity: item.quantity,
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
      });
    });

    const orderData = {
      isPaid: false,
      orderItems: products,
      userId,
      order_status: "PROCESSING",
      cakeMessage,
      note,
      createdAt: serverTimestamp(),
    };

    const orderRef = await addDoc(
      collection(db, "stores", params.storeId, "orders"),
      orderData
    );

    const id = orderRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "orders", id), {
      ...orderData,
      id,
      updatedAt: serverTimestamp(),
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["IN", "US", "CN", "GB"],
      },
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancelled=1`,
      metadata: {
        orderId: id,
        storeId: params.storeId,
      },
    });

    return NextResponse.json({ url: session.url }, { headers: corsHeaders });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
