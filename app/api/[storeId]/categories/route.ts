import { db } from "@/lib/firebase";
import { Categories } from "@/types/types";
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

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      const storeData = store.data();

      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const categoryData = {
      name,
      billboardId,
      billboardLabel,
      createdAt: serverTimestamp(),
    };

    const categoryRef = await addDoc(
      collection(db, "stores", params.storeId, "categories"),
      categoryData
    );

    const id = categoryRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "categories", id), {
      ...categoryData,
      id,
      updatedAt: serverTimestamp(),
    });

    // Retrieve the newly created document
    const createdCategory = (
      await getDoc(doc(db, "stores", params.storeId, "categories", id))
    ).data() as Categories;

    // Convert Firestore Timestamps to plain objects
    const formattedCategory = {
      ...createdCategory,
      createdAt: createdCategory.createdAt?.toDate().toISOString(),
      updatedAt: createdCategory.updatedAt?.toDate().toISOString(),
    };

    return NextResponse.json(formattedCategory);
  } catch (error) {
    console.log(`[CATEGORY_POST]: ${error}`);
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

    const categoriesData = (
      await getDocs(collection(doc(db, "stores", params.storeId), "categories"))
    ).docs.map((doc) => {
      const data = doc.data() as Categories;

      // Convert Firestore Timestamps to plain objects
      return {
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString(),
      };
    });

    return NextResponse.json(categoriesData);
  } catch (error) {
    console.log(`[CATEGORY_GET]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
