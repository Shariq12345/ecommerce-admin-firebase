import { db } from "@/lib/firebase";
import { Categories, Flavors } from "@/types/types";
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
  { params }: { params: { storeId: string; flavorId: string } }
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

    if (!params.flavorId) {
      return new NextResponse("Flavor Id is Required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();

      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const flavorRef = await getDoc(
      doc(db, "stores", params.storeId, "flavors", params.flavorId)
    );

    if (flavorRef.exists()) {
      await updateDoc(
        doc(db, "stores", params.storeId, "flavors", params.flavorId),
        {
          ...flavorRef.data(),
          name,
          value,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
      return new NextResponse("Flavor Not Found", { status: 404 });
    }

    const flavor = (
      await getDoc(
        doc(db, "stores", params.storeId, "flavors", params.flavorId)
      )
    ).data() as Flavors;

    return NextResponse.json({ flavor });
  } catch (error) {
    console.log(`[FLAVOR_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; flavorId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is Required", { status: 400 });
    }

    if (!params.flavorId) {
      return new NextResponse("Flavor Id is Required", { status: 400 });
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
      "flavors",
      params.flavorId
    );

    await deleteDoc(categoryRef);

    return NextResponse.json({ msg: "Flavor Deleted" });
  } catch (error) {
    console.log(`[FLAVOR_DELETE]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
