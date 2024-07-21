import React from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Flavors } from "@/types/types";
import { FlavorColumn } from "./components/columns";
import { format } from "date-fns";
import FlavorClient from "./components/client";

type Props = {
  params: {
    storeId: string;
  };
};

const FlavorsPage = async ({ params }: Props) => {
  const flavorsData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "flavors"))
  ).docs.map((doc) => doc.data()) as Flavors[];

  const formattedFlavors: FlavorColumn[] = flavorsData.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FlavorClient data={formattedFlavors} />
      </div>
    </div>
  );
};

export default FlavorsPage;
