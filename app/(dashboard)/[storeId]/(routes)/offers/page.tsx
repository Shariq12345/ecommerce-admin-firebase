import React from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Offers } from "@/types/types";
import { OfferColumn } from "./components/columns";
import { format } from "date-fns";
import OfferClient from "./components/client";

type Props = {
  params: {
    storeId: string;
  };
};

const OffersPage = async ({ params }: Props) => {
  const offersData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "offers"))
  ).docs.map((doc) => doc.data()) as Offers[];

  const formattedOffers: OfferColumn[] = offersData.map((item) => ({
    id: item.id,
    name: item.name,
    code: item.code,
    discount: item.discount,
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OfferClient data={formattedOffers} />
      </div>
    </div>
  );
};

export default OffersPage;
