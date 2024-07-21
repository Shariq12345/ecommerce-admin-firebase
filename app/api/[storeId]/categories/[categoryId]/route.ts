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
  { params }: { params: { storeId: string; categoryId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, billboardLabel, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard Id is Required", { status: 400 });
    }

    if (!billboardLabel) {
      return new NextResponse("Billboard Name is Required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Category Name is Required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is Required", { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category Id is Required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();

      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const categoryRef = await getDoc(
      doc(db, "stores", params.storeId, "categories", params.categoryId)
    );

    if (categoryRef.exists()) {
      await updateDoc(
        doc(db, "stores", params.storeId, "categories", params.categoryId),
        {
          ...categoryRef.data(),
          name,
          billboardId,
          billboardLabel,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
      return new NextResponse("Category Not Found", { status: 404 });
    }

    const category = (
      await getDoc(
        doc(db, "stores", params.storeId, "categories", params.categoryId)
      )
    ).data() as Categories;

    return NextResponse.json({ category });
  } catch (error) {
    console.log(`[CATEGORY_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is Required", { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category Id is Required", { status: 400 });
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
      "categories",
      params.categoryId
    );

    await deleteDoc(categoryRef);

    return NextResponse.json({ msg: "Category Deleted" });
  } catch (error) {
    console.log(`[CATEGORY_DELETE]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
