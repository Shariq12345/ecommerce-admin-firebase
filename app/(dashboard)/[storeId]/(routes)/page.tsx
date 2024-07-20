import { db } from "@/lib/firebase";
import { Store } from "@/types/types";
import { doc, getDoc } from "firebase/firestore";
import React from "react";

interface DashboardPageProps {
  params: {
    storeId: string;
  };
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const store = (
    await getDoc(doc(db, "stores", params.storeId))
  ).data() as Store;
  return <div>{store.name}</div>;
};

export default DashboardPage;
