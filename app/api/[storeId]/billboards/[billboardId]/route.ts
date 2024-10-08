import { db } from "@/lib/firebase";
import { Billboards } from "@/types/types";
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
  { params }: { params: { storeId: string; billboardId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!label) {
      return new NextResponse("Billboard Label is Required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Billboard Image is Required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is Required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard Id is Required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();

      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const billboardRef = await getDoc(
      doc(db, "stores", params.storeId, "billboards", params.billboardId)
    );

    if (billboardRef.exists()) {
      await updateDoc(
        doc(db, "stores", params.storeId, "billboards", params.billboardId),
        {
          ...billboardRef.data(),
          label,
          imageUrl,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
      return new NextResponse("Billboard Not Found", { status: 404 });
    }

    const billboard = (
      await getDoc(
        doc(db, "stores", params.storeId, "billboards", params.billboardId)
      )
    ).data() as Billboards;

    const formattedBillboard = {
      ...billboard,
      createdAt: billboard.createdAt?.toDate().toISOString(), // Convert to ISO string
      updatedAt: billboard.updatedAt?.toDate().toISOString(), // Convert to ISO string
    };

    return NextResponse.json({ billboard: formattedBillboard });
  } catch (error) {
    console.log(`[BILLBOARD_POST]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is Required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard Id is Required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();

      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const billboardRef = doc(
      db,
      "stores",
      params.storeId,
      "billboards",
      params.billboardId
    );

    await deleteDoc(billboardRef);

    return NextResponse.json({ msg: "Billboard Deleted" });
  } catch (error) {
    console.log(`[BILLBOARD_POST]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
