import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000", // Your frontend origin
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle PATCH requests (actual API)
export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; reviewId: string } }
) => {
  try {
    const body = await req.json();
    const { content, rating } = body;

    if (!content && rating === undefined) {
      return new NextResponse(
        "At least one field (content or rating) is required",
        { status: 400, headers: corsHeaders }
      );
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is Required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!params.reviewId) {
      return new NextResponse("Review Id is Required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Check if the review exists and belongs to the user
    const reviewRef = doc(
      db,
      "stores",
      params.storeId,
      "reviews",
      params.reviewId
    );
    const reviewSnapshot = await getDoc(reviewRef);

    if (reviewSnapshot.exists()) {
      const reviewData = reviewSnapshot.data();

      await updateDoc(reviewRef, {
        ...reviewData,
        content: content || reviewData.content,
        rating: rating !== undefined ? rating : reviewData.rating,
        updatedAt: serverTimestamp(),
      });

      return new NextResponse(JSON.stringify({ msg: "Review Updated" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      return new NextResponse("Review Not Found", {
        status: 404,
        headers: corsHeaders,
      });
    }
  } catch (error) {
    console.log(`[REVIEW_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
};

// Handle DELETE requests (actual API)
export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; reviewId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store Id is Required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!params.reviewId) {
      return new NextResponse("Review Id is Required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Check if the review exists and belongs to the user
    const reviewRef = doc(
      db,
      "stores",
      params.storeId,
      "reviews",
      params.reviewId
    );
    const reviewSnapshot = await getDoc(reviewRef);

    if (reviewSnapshot.exists()) {
      const reviewData = reviewSnapshot.data();

      await deleteDoc(reviewRef);

      return new NextResponse(JSON.stringify({ msg: "Review Deleted" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      return new NextResponse("Review Not Found", {
        status: 404,
        headers: corsHeaders,
      });
    }
  } catch (error) {
    console.log(`[REVIEW_DELETE]: ${error}`);
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
