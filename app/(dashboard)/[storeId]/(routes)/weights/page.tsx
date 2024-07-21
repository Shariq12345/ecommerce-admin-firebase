import React from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Weights } from "@/types/types";
import { WeightColumn } from "./components/columns";
import { format } from "date-fns";
import WeightClient from "./components/client";

type Props = {
  params: {
    storeId: string;
  };
};

const WeightsPage = async ({ params }: Props) => {
  const weightsData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "weights"))
  ).docs.map((doc) => doc.data()) as Weights[];

  const formattedWeights: WeightColumn[] = weightsData.map((item) => ({
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
        <WeightClient data={formattedWeights} />
      </div>
    </div>
  );
};

export default WeightsPage;
