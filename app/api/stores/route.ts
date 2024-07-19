import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const storeData = {
      userId,
      name,
      createdAt: serverTimestamp(),
    };

    // ADD DATA TO FIRESTORE AND GET THE REFERENCE ID
    const storeRef = await addDoc(collection(db, "stores"), storeData);

    // GET THE REFERENCE ID
    const id = storeRef.id;

    await updateDoc(doc(db, "stores", id), {
      ...storeData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...storeData });
  } catch (error) {
    console.log("[STORES_POST]", error);
    return new NextResponse("Failed to create store", { status: 500 });
  }
};
