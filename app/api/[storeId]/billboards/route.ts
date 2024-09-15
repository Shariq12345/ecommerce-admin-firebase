import { db } from "@/lib/firebase";
import { Billboards } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
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

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      const storeData = store.data();

      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const billboardData = {
      label,
      imageUrl,
      createdAt: serverTimestamp(),
    };

    const billboardRef = await addDoc(
      collection(db, "stores", params.storeId, "billboards"),
      billboardData
    );

    const id = billboardRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "billboards", id), {
      ...billboardData,
      id,
      updatedAt: serverTimestamp(),
    });

    // Retrieve the newly created document
    const createdBillboard = (
      await getDoc(doc(db, "stores", params.storeId, "billboards", id))
    ).data() as Billboards;

    // Convert Firestore Timestamps to plain objects
    const formattedBillboard = {
      ...createdBillboard,
      createdAt: createdBillboard.createdAt?.toDate().toISOString(),
      updatedAt: createdBillboard.updatedAt?.toDate().toISOString(),
    };

    return NextResponse.json(formattedBillboard);
  } catch (error) {
    console.log(`[BILLBOARD_POST]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store Id is Required", { status: 400 });
    }

    const billboardsData = (
      await getDocs(collection(doc(db, "stores", params.storeId), "billboards"))
    ).docs.map((doc) => {
      const data = doc.data() as Billboards;

      // Convert Firestore Timestamps to plain objects
      return {
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString(),
      };
    });

    return NextResponse.json(billboardsData);
  } catch (error) {
    console.log(`[BILLBOARD_GET]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
