import React from "react";
import { collection, doc, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Review } from "@/types/types";
import { ReviewColumn } from "./components/columns";
import { format } from "date-fns";
import ReviewClient from "./components/client";

type Props = {
  params: {
    storeId: string;
  };
};

const ReviewsPage = async ({ params }: Props) => {
  const reviewsData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "reviews"))
  ).docs.map((doc) => doc.data()) as Review[];

  const formattedReviews: ReviewColumn[] = reviewsData.map((item) => ({
    id: item.id,
    content: item.content,
    rating: item.rating,
    productId: item.productId,
    emailAddress: item.emailAddress,
    createdAt:
      item.createdAt instanceof Timestamp
        ? format(item.createdAt.toDate(), "MMMM do, yyyy")
        : item.createdAt
        ? format(new Date(item.createdAt), "MMMM do, yyyy") // Handle if already a Date or string
        : "",
  }));

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ReviewClient data={formattedReviews} />
      </div>
    </div>
  );
};

export default ReviewsPage;
