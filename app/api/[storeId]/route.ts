import { db } from "@/lib/firebase";
import { Store } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const docRef = doc(db, "stores", params.storeId);

    await updateDoc(docRef, { name });

    const store = (await getDoc(docRef)).data() as Store;

    return NextResponse.json({ store });
  } catch (error) {
    console.log("[STORES_PATCH]", error);
    return new NextResponse("Failed to update store", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const docRef = doc(db, "stores", params.storeId);

    // TODO: Delete all the subcollections also data file urls

    await deleteDoc(docRef);

    return NextResponse.json({ message: "Store deleted" });
  } catch (error) {
    console.log("[STORES_DELETE]", error);
    return new NextResponse("Failed to delete store", { status: 500 });
  }
};
