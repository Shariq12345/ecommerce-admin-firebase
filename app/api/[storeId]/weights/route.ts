import { db } from "@/lib/firebase";
import { Weights } from "@/types/types";
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
    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Weight Value is Required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Weight Name is Required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is Required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();

      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const weightData = {
      name,
      value,
      createdAt: serverTimestamp(),
    };

    const weightRef = await addDoc(
      collection(db, "stores", params.storeId, "weights"),
      weightData
    );

    const id = weightRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "weights", id), {
      ...weightData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...weightData });
  } catch (error) {
    console.log(`[WEIGHT_POST]: ${error}`);
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

    const weightsData = (
      await getDocs(collection(doc(db, "stores", params.storeId), "weights"))
    ).docs.map((doc) => doc.data()) as Weights[];

    return NextResponse.json(weightsData);
  } catch (error) {
    console.log(`[CATEGORY_GET]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
