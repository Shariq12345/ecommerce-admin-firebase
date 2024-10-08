import { db } from "@/lib/firebase";
import { Order } from "@/types/types";
import { auth } from "@clerk/nextjs/server";

import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; orderId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { order_status, cakeMessage, note } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    if (!order_status) {
      return new NextResponse("Order Status is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!params.orderId) {
      return new NextResponse("Order Id is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized Access", { status: 403 });
      }
    }

    const orderRef = await getDoc(
      doc(db, "stores", params.storeId, "orders", params.orderId)
    );

    if (orderRef.exists()) {
      const updatedData: Partial<Order> = {
        ...orderRef.data(),
        order_status,
        updatedAt: serverTimestamp(),
      };

      // Add cakeMessage and note if they exist in the body
      if (cakeMessage) updatedData.cakeMessage = cakeMessage;
      if (note) updatedData.note = note;

      console.log("Cake Message:", cakeMessage);
      console.log("Order Note:", note);

      await updateDoc(
        doc(db, "stores", params.storeId, "orders", params.orderId),
        updatedData
      );
    } else {
      return new NextResponse("Order Not Found", { status: 404 });
    }

    const order = (
      await getDoc(doc(db, "stores", params.storeId, "orders", params.orderId))
    ).data() as Order;

    return NextResponse.json(order);
  } catch (error) {
    console.log(`[ORDER_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; orderId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!params.orderId) {
      return new NextResponse("Order is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized Access", { status: 403 });
      }
    }

    const docRef = doc(db, "stores", params.storeId, "orders", params.orderId);

    await deleteDoc(docRef);

    return NextResponse.json({ msg: "Order Deleted" });
  } catch (error) {
    console.log(`[ORDER_DELETE] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
