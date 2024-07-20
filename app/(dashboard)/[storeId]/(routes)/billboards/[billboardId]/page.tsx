import React from "react";
import { doc, getDoc } from "firebase/firestore";
import BillboardForm from "./components/billboard-form";
import { db } from "@/lib/firebase";
import { Billboards } from "@/types/types";

type Props = {
  params: {
    billboardId: string;
    storeId: string;
  };
};

const BillboardPage = async ({ params }: Props) => {
    
  const billboard = (await (
    await getDoc(
      doc(db, "stores", params.storeId, "billboards", params.billboardId)
    )
  ).data()) as Billboards;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
