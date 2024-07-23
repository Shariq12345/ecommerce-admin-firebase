import { db, storage } from "@/lib/firebase";
import { Store } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
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

    // Delete all the subcollections also data file urls

    // BILLBOARDS & IMAGES
    const billboardsQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/billboards`)
    );
    billboardsQuerySnapshot.forEach(async (billboardDoc) => {
      await deleteDoc(billboardDoc.ref);
      // Remove IMAGES
      const imageUrl = billboardDoc.data().imageUrl;

      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }
    });

    // CATEGORIES
    const categoriesQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/categories`)
    );
    categoriesQuerySnapshot.forEach(async (categoryDoc) => {
      await deleteDoc(categoryDoc.ref);
    });

    // WEIGHTS
    const weightsQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/weights`)
    );
    weightsQuerySnapshot.forEach(async (categoryDoc) => {
      await deleteDoc(categoryDoc.ref);
    });

    // FLAVORS
    const flavorsQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/flavors`)
    );
    flavorsQuerySnapshot.forEach(async (categoryDoc) => {
      await deleteDoc(categoryDoc.ref);
    });

    // PRODUCTS & IMAGES
    const productsQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/products`)
    );
    productsQuerySnapshot.forEach(async (productDoc) => {
      await deleteDoc(productDoc.ref);

      // Remove IMAGES
      const imagesArray = productDoc.data().images;

      if (imagesArray && Array.isArray(imagesArray)) {
        await Promise.all(
          imagesArray.map(async (image) => {
            const imageRef = ref(storage, image.url);
            await deleteObject(imageRef);
          })
        );
      }
    });

    // ORDERS & IMAGES
    const ordersQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/orders`)
    );
    ordersQuerySnapshot.forEach(async (orderDoc) => {
      await deleteDoc(orderDoc.ref);

      const orderItemsArray = orderDoc.data().orderItems;
      if (orderItemsArray && Array.isArray(orderItemsArray)) {
        await Promise.all(
          orderItemsArray.map(async (orderItem) => {
            const imagesArray = orderItem.images;

            if (imagesArray && Array.isArray(imagesArray)) {
              await Promise.all(
                imagesArray.map(async (image) => {
                  const imageRef = ref(storage, image.url);
                  await deleteObject(imageRef);
                })
              );
            }
          })
        );
      }
    });

    // DELETE STORE
    await deleteDoc(docRef);

    return NextResponse.json({ message: "Store deleted" });
  } catch (error) {
    console.log("[STORES_DELETE]", error);
    return new NextResponse("Failed to delete store", { status: 500 });
  }
};
