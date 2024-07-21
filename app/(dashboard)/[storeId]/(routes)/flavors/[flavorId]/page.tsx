import React from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Flavors } from "@/types/types";
import FlavorForm from "./components/flavor-form";

type Props = {
  params: {
    flavorId: string;
    storeId: string;
  };
};

const FlavorPage = async ({ params }: Props) => {
  const flavor = (await (
    await getDoc(doc(db, "stores", params.storeId, "flavors", params.flavorId))
  ).data()) as Flavors;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <FlavorForm initialData={flavor} />
      </div>
    </div>
  );
};

export default FlavorPage;
