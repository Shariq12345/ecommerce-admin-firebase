import React from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Offers, Weights } from "@/types/types";
import OfferForm from "./components/offer-form";

type Props = {
  params: {
    offerId: string;
    storeId: string;
  };
};

const OfferPage = async ({ params }: Props) => {
  const offer = (await (
    await getDoc(doc(db, "stores", params.storeId, "offers", params.offerId))
  ).data()) as Offers;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <OfferForm initialData={offer} />
      </div>
    </div>
  );
};

export default OfferPage;
