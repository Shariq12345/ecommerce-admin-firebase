import React from "react";
import { collection, doc, getDocs } from "firebase/firestore";
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
  const reviewsSnapshot = await getDocs(collection(db, "reviews"));
  const reviewData = reviewsSnapshot.docs.map((doc) => doc.data()) as Review[];

  const formattedReviews: ReviewColumn[] = reviewData.map((item) => ({
    id: item.id,
    userId: item.userId,
    rating: item.rating,
    content: item.content,
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
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
