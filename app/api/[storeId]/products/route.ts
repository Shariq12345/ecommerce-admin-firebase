import { db } from "@/lib/firebase";
import { Product } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";

// export const POST = async (
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) => {
//   try {
//     // const { userId } = auth();
//     const { userId, sessionId } = auth();
//     console.log("Auth Data:", { userId, sessionId });

//     const body = await req.json();
//     const {
//       name,
//       price,
//       category,
//       weight,
//       flavor,
//       images,
//       isFeatured,
//       isArchived,
//       description,
//       discount = 0,
//     } = body;

//     if (!userId) {
//       return new NextResponse("Unauthenticated", { status: 401 });
//     }
//     if (!name) {
//       console.log("Missing name:", name);
//       return new NextResponse("Name is required", { status: 400 });
//     }
//     if (!price) {
//       console.log("Missing price:", price);
//       return new NextResponse("Price is required", { status: 400 });
//     }
//     if (!description) {
//       console.log("Missing description:", description);
//       return new NextResponse("Description is required", { status: 400 });
//     }
//     if (discount === undefined || discount === null) {
//       console.log("Missing discount:", discount);
//       return new NextResponse("Discount is required", { status: 400 });
//     }
//     if (!category) {
//       console.log("Missing category:", category);
//       return new NextResponse("Category Id is required", { status: 400 });
//     }
//     if (!weight) {
//       console.log("Missing weight:", weight);
//       return new NextResponse("Weight Id is required", { status: 400 });
//     }
//     if (!flavor) {
//       console.log("Missing flavor:", flavor);
//       return new NextResponse("Flavor Id is required", { status: 400 });
//     }
//     if (!images || !images.length) {
//       console.log("Missing images:", images);
//       return new NextResponse("Images are required", { status: 400 });
//     }
//     if (!params.storeId) {
//       console.log("Missing storeId:", params.storeId);
//       return new NextResponse("Store ID is required", { status: 400 });
//     }

//     const store = await getDoc(doc(db, "stores", params.storeId));

//     if (store.exists()) {
//       let storeData = store.data();

//       if (storeData?.userId !== userId) {
//         return new NextResponse("Unauthorized", { status: 500 });
//       }
//     }

//     const productData = {
//       name,
//       price,
//       category,
//       weight,
//       flavor,
//       images,
//       isFeatured,
//       isArchived,
//       description,
//       discount,
//       createdAt: serverTimestamp(),
//     };

//     const productRef = await addDoc(
//       collection(db, "stores", params.storeId, "products"),
//       productData
//     );

//     const id = productRef.id;

//     await updateDoc(doc(db, "stores", params.storeId, "products", id), {
//       ...productData,
//       id,
//       updatedAt: serverTimestamp(),
//     });

//     return NextResponse.json({ id, ...productData });
//   } catch (error) {
//     console.log(`[PRODUCT_POST]: ${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId, sessionId } = auth();
    const body = await req.json();
    const {
      name,
      price,
      category,
      weight,
      flavor,
      images,
      isFeatured,
      isArchived,
      description,
      discount = 0,
    } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const searchableKeywords = [
      name.toLowerCase(),
      category.toLowerCase(),
      flavor.toLowerCase(),
      ...name.toLowerCase().split(" "), // Split product name into keywords
    ];

    const productData = {
      name,
      price,
      category,
      weight,
      flavor,
      images,
      isFeatured,
      isArchived,
      description,
      discount,
      searchableKeywords, // Store searchable keywords
      createdAt: serverTimestamp(),
    };

    const productRef = await addDoc(
      collection(db, "stores", params.storeId, "products"),
      productData
    );

    const id = productRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "products", id), {
      ...productData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...productData });
  } catch (error) {
    console.log(`[PRODUCT_POST]: ${error}`);
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

    const { searchParams } = new URL(req.url);
    const productRef = collection(
      doc(db, "stores", params.storeId),
      "products"
    );

    let queryConstraints = [];

    // Add category, weight, flavor filters if present
    if (searchParams.has("category")) {
      queryConstraints.push(
        where("category", "==", searchParams.get("category"))
      );
    }
    if (searchParams.has("weight")) {
      queryConstraints.push(where("weight", "==", searchParams.get("weight")));
    }
    if (searchParams.has("flavor")) {
      queryConstraints.push(where("flavor", "==", searchParams.get("flavor")));
    }
    if (searchParams.has("isFeatured")) {
      queryConstraints.push(
        where(
          "isFeatured",
          "==",
          searchParams.get("isFeatured") === "true" ? true : false
        )
      );
    }
    if (searchParams.has("isArchived")) {
      queryConstraints.push(
        where(
          "isArchived",
          "==",
          searchParams.get("isArchived") === "true" ? true : false
        )
      );
    }

    // More powerful search: match search query across name, category, and flavor
    if (searchParams.has("search")) {
      const searchQuery = searchParams.get("search")?.toLowerCase();
      const searchWords = searchQuery?.split(" ");

      // Search across the searchableKeywords field
      queryConstraints.push(
        where("searchableKeywords", "array-contains-any", searchWords)
      );
    }

    let productsQuery;
    if (queryConstraints.length > 0) {
      productsQuery = query(productRef, and(...queryConstraints));
    } else {
      productsQuery = query(productRef);
    }

    const querySnapshot = await getDocs(productsQuery);
    const productData: Product[] = querySnapshot.docs.map(
      (doc) => doc.data() as Product
    );

    return NextResponse.json(productData);
  } catch (error) {
    console.log(`[PRODUCT_GET]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// export const GET = async (
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) => {
//   try {
//     if (!params.storeId) {
//       return new NextResponse("Store Id is Required", { status: 400 });
//     }

//     const { searchParams } = new URL(req.url);
//     const productRef = collection(
//       doc(db, "stores", params.storeId),
//       "products"
//     );

//     let queryConstraints: any[] = [];

//     // Add filters if present
//     if (searchParams.has("category")) {
//       queryConstraints.push(
//         where("category", "==", searchParams.get("category"))
//       );
//     }
//     if (searchParams.has("weight")) {
//       queryConstraints.push(where("weight", "==", searchParams.get("weight")));
//     }
//     if (searchParams.has("flavor")) {
//       queryConstraints.push(where("flavor", "==", searchParams.get("flavor")));
//     }
//     if (searchParams.has("isFeatured")) {
//       queryConstraints.push(
//         where(
//           "isFeatured",
//           "==",
//           searchParams.get("isFeatured") === "true" ? true : false
//         )
//       );
//     }
//     if (searchParams.has("isArchived")) {
//       queryConstraints.push(
//         where(
//           "isArchived",
//           "==",
//           searchParams.get("isArchived") === "true" ? true : false
//         )
//       );
//     }

//     // Powerful search query: search across name, category, and flavor
//     if (searchParams.has("search")) {
//       const searchQuery = searchParams.get("search")?.toLowerCase();
//       const searchWords = searchQuery?.split(" ");

//       queryConstraints.push(
//         where("searchableKeywords", "array-contains-any", searchWords)
//       );
//     }

//     // Pagination: Get page and limit from searchParams
//     const limitParam = parseInt(searchParams.get("limit") || "10", 10); // Default limit is 10
//     const pageParam = parseInt(searchParams.get("page") || "1", 10); // Default page is 1
//     const offset = (pageParam - 1) * limitParam; // Calculate the offset

//     let productsQuery;
//     if (queryConstraints.length > 0) {
//       productsQuery = query(productRef, and(...queryConstraints), limit(limitParam));
//     } else {
//       productsQuery = query(productRef, limit(limitParam));
//     }

//     // Fetch all products to get the correct starting point for pagination
//     const snapshot = await getDocs(productsQuery);
//     const allProducts = snapshot.docs.map(doc => doc.data() as Product);

//     // Handle pagination by skipping the offset
//     const paginatedProducts = allProducts.slice(offset, offset + limitParam);

//     return NextResponse.json({
//       products: paginatedProducts,
//       totalProducts: allProducts.length,
//       currentPage: pageParam,
//       totalPages: Math.ceil(allProducts.length / limitParam),
//     });
//   } catch (error) {
//     console.log(`[PRODUCT_GET]: ${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };
