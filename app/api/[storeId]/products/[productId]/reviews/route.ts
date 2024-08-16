import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Review } from "@/types/types";
import { setCorsHeaders } from "@/lib/cors"; // Import the CORS helper

export const POST = async (
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) => {
  if (req.method === "OPTIONS") {
    const response = new NextResponse();
    return setCorsHeaders(response);
  }

  try {
    const { userId } = auth();
    const body = await req.json();
    const { rating, comment } = body;

    if (!userId) {
      return setCorsHeaders(
        new NextResponse("Unauthenticated", { status: 401 })
      );
    }
    if (!rating) {
      return setCorsHeaders(
        new NextResponse("Rating is required", { status: 400 })
      );
    }
    if (!params.productId) {
      return setCorsHeaders(
        new NextResponse("Product ID is required", { status: 400 })
      );
    }

    // Check if the product exists
    const productDoc = await getDoc(doc(db, "products", params.productId));
    if (!productDoc.exists()) {
      return setCorsHeaders(
        new NextResponse("Product not found", { status: 404 })
      );
    }

    // Check if the user has already reviewed this product
    const existingReviews = await getDocs(
      query(
        collection(db, "products", params.productId, "reviews"),
        where("userId", "==", userId)
      )
    );

    if (!existingReviews.empty) {
      return setCorsHeaders(
        new NextResponse("You have already reviewed this product", {
          status: 400,
        })
      );
    }

    const reviewData = {
      userId,
      rating,
      comment,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const reviewRef = await addDoc(
      collection(db, "products", params.productId, "reviews"),
      reviewData
    );

    const id = reviewRef.id;

    await updateDoc(doc(db, "products", params.productId, "reviews", id), {
      ...reviewData,
      id,
      updatedAt: serverTimestamp(),
    });

    return setCorsHeaders(NextResponse.json({ id, ...reviewData }));
  } catch (error) {
    console.error(`[REVIEW_POST]: ${error}`);
    return setCorsHeaders(
      new NextResponse("Internal Server Error", { status: 500 })
    );
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { productId: string } }
) => {
  if (req.method === "OPTIONS") {
    const response = new NextResponse();
    return setCorsHeaders(response);
  }

  try {
    if (!params.productId) {
      return setCorsHeaders(
        new NextResponse("Product ID is required", { status: 400 })
      );
    }

    const reviewsData = (
      await getDocs(
        collection(doc(db, "products", params.productId), "reviews")
      )
    ).docs.map((doc) => doc.data()) as Review[];

    return setCorsHeaders(NextResponse.json(reviewsData));
  } catch (error) {
    console.log(`[REVIEW_GET]: ${error}`);
    return setCorsHeaders(
      new NextResponse("Internal Server Error", { status: 500 })
    );
  }
};
