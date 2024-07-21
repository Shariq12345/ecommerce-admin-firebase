import { db } from "@/lib/firebase";
import { Categories } from "@/types/types";
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
  { params }: { params: { storeId: string; weightId: string } }
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

    if (!params.weightId) {
      return new NextResponse("Weight Id is Required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();

      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const weightRef = await getDoc(
      doc(db, "stores", params.storeId, "weights", params.weightId)
    );

    if (weightRef.exists()) {
      await updateDoc(
        doc(db, "stores", params.storeId, "weights", params.weightId),
        {
          ...weightRef.data(),
          name,
          value,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
      return new NextResponse("Weight Not Found", { status: 404 });
    }

    const weight = (
      await getDoc(
        doc(db, "stores", params.storeId, "weights", params.weightId)
      )
    ).data() as Categories;

    return NextResponse.json({ weight });
  } catch (error) {
    console.log(`[WEIGHT_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; weightId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is Required", { status: 400 });
    }

    if (!params.weightId) {
      return new NextResponse("Weight Id is Required", { status: 400 });
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
      "weights",
      params.weightId
    );

    await deleteDoc(categoryRef);

    return NextResponse.json({ msg: "Weight Deleted" });
  } catch (error) {
    console.log(`[WEIGHT_DELETE]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
