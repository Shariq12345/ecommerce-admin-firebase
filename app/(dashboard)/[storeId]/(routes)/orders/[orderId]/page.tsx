import React from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Weights } from "@/types/types";
import WeightForm from "./components/weight-form";

type Props = {
  params: {
    weightId: string;
    storeId: string;
  };
};

const WeightPage = async ({ params }: Props) => {
  const weight = (await (
    await getDoc(doc(db, "stores", params.storeId, "weights", params.weightId))
  ).data()) as Weights;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <WeightForm initialData={weight} />
      </div>
    </div>
  );
};

export default WeightPage;
