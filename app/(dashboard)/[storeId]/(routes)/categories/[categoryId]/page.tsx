import React from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Billboards, Categories } from "@/types/types";
import CategoryForm from "./components/category-form";

type Props = {
  params: {
    categoryId: string;
    storeId: string;
  };
};

const CategoryPage = async ({ params }: Props) => {
  const category = (await (
    await getDoc(
      doc(db, "stores", params.storeId, "categories", params.categoryId)
    )
  ).data()) as Categories;

  const billboards = (
    await getDocs(collection(doc(db, "stores", params.storeId), "billboards"))
  ).docs.map((doc) => doc.data()) as Billboards[];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
};

export default CategoryPage;
