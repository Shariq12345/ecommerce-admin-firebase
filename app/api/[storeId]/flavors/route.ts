import { db } from "@/lib/firebase";
import { Flavors } from "@/types/types";
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
      return new NextResponse("Flavor Value is Required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Flavor Name is Required", { status: 400 });
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

    const flavorData = {
      name,
      value,
      createdAt: serverTimestamp(),
    };

    const flavorRef = await addDoc(
      collection(db, "stores", params.storeId, "flavors"),
      flavorData
    );

    const id = flavorRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "flavors", id), {
      ...flavorData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...flavorData });
  } catch (error) {
    console.log(`[FLAVOR_POST]: ${error}`);
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

    const flavorsData = (
      await getDocs(collection(doc(db, "stores", params.storeId), "flavors"))
    ).docs.map((doc) => doc.data()) as Flavors[];

    return NextResponse.json(flavorsData);
  } catch (error) {
    console.log(`[FLAVOR_GET]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
