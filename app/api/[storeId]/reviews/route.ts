import { db } from "@/lib/firebase";
import { Review } from "@/types/types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000", // Your frontend origin
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle POST requests (actual API)
export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const body = await req.json();
    const { content, rating, userName, productId, emailAddress } = body;

    console.log("Received body:", body);

    if (!params.storeId) {
      return new NextResponse("Store ID is Required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!content) {
      return new NextResponse("Review Content is Required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!rating) {
      return new NextResponse("Review Rating is Required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!userName) {
      return new NextResponse("User Name is Required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!productId) {
      return new NextResponse("Product ID is Required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    // You would typically insert the review in the database here.
    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
    }

    const reviewData = {
      content,
      rating,
      userName,
      productId,
      emailAddress,
      createdAt: new Date().toISOString(),
    };

    const reviewRef = await addDoc(
      collection(db, "stores", params.storeId, "reviews"),
      reviewData
    );

    const id = reviewRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "reviews", id), {
      ...reviewData,
      id,
    });

    return new NextResponse(id, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.log(`[REVIEW_POST Error]: ${error}`);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
};

// Handle OPTIONS request (CORS preflight)
export const OPTIONS = () => {
  return new NextResponse(null, {
    headers: corsHeaders,
  });
};

// export const GET = async (
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) => {
//   const corsHeaders = {
//     "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",,
//   };

//   try {
//     if (!params.storeId) {
//       return new NextResponse("Store Id is Required", { status: 400 });
//     }

//     const reviewsData = (
//       await getDocs(collection(doc(db, "stores", params.storeId), "reviews"))
//     ).docs.map((doc) => doc.data()) as Review[];

//     return new NextResponse(JSON.stringify(reviewsData), {
//       status: 200,
//       headers: {
//         ...corsHeaders,
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     console.log(`[REVIEW_GET]: ${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin":
      process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
  };

  // Extract productId from query parameters
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  try {
    // Validate storeId and productId
    if (!params.storeId) {
      return new NextResponse("Store Id is Required", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("Product Id is Required", { status: 400 });
    }

    // Query the Firestore collection for reviews of the specific product
    const reviewsQuery = query(
      collection(doc(db, "stores", params.storeId), "reviews"),
      where("productId", "==", productId) // Filter reviews by productId
    );

    // Fetch the reviews
    const reviewsSnapshot = await getDocs(reviewsQuery);
    const reviewsData = reviewsSnapshot.docs.map((doc) =>
      doc.data()
    ) as Review[];

    return new NextResponse(JSON.stringify(reviewsData), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(`[REVIEW_GET]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
