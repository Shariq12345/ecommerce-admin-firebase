import { db } from "@/lib/firebase";
import { Categories, Offers } from "@/types/types";
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
  { params }: { params: { storeId: string; offerId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, code, discount } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!code) {
      return new NextResponse("Offer code is Required", { status: 400 });
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

    if (!params.offerId) {
      return new NextResponse("Offer Id is Required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();

      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const offerRef = await getDoc(
      doc(db, "stores", params.storeId, "offers", params.offerId)
    );

    if (offerRef.exists()) {
      await updateDoc(
        doc(db, "stores", params.storeId, "offers", params.offerId),
        {
          ...offerRef.data(),
          name,
          code,
          discount,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
      return new NextResponse("Offer Not Found", { status: 404 });
    }

    const offer = (
      await getDoc(doc(db, "stores", params.storeId, "offers", params.offerId))
    ).data() as Offers;

    return NextResponse.json({ offer });
  } catch (error) {
    console.log(`[OFFER_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; offerId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is Required", { status: 400 });
    }

    if (!params.offerId) {
      return new NextResponse("Offer Id is Required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();

      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const categoryRef = doc(
      db,
      "stores",
      params.storeId,
      "offers",
      params.offerId
    );

    await deleteDoc(categoryRef);

    return NextResponse.json({ msg: "Offer Deleted" });
  } catch (error) {
    console.log(`[OFFER_DELETE]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
