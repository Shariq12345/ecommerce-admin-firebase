import { db } from "@/lib/firebase";
import { Offers } from "@/types/types";
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
    const { name, code, discount } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!code) {
      return new NextResponse("Offer Code is Required", { status: 400 });
    }

    if (!discount) {
      return new NextResponse("Offer Discount is Required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Offer Name is Required", { status: 400 });
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

    const offerData = {
      name,
      code,
      discount,
      createdAt: serverTimestamp(),
    };

    const offerRef = await addDoc(
      collection(db, "stores", params.storeId, "offers"),
      offerData
    );

    const id = offerRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "offers", id), {
      ...offerData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...offerData });
  } catch (error) {
    console.log(`[OFFER_POST]: ${error}`);
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

    const offersData = (
      await getDocs(collection(doc(db, "stores", params.storeId), "offers"))
    ).docs.map((doc) => doc.data()) as Offers[];

    return NextResponse.json(offersData);
  } catch (error) {
    console.log(`[OFFER_GET]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
