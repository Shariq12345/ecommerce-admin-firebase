import React from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Categories } from "@/types/types";
import { CategoryColumn } from "./components/columns";
import { format } from "date-fns";
import CategoryClient from "./components/client";

type Props = {
  params: {
    storeId: string;
  };
};

const CategoriesPage = async ({ params }: Props) => {
  const categoriesData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "categories"))
  ).docs.map((doc) => doc.data()) as Categories[];

  const formattedCategories: CategoryColumn[] = categoriesData.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboardLabel,
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
