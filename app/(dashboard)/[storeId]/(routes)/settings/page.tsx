import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Store } from "@/types/types";
import SettingsForm from "./settings-form";

type Props = {
  params: {
    storeId: string;
  };
};

const SettingsPage = async ({ params }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // const store = (
  //   await getDoc(doc(db, "stores", params.storeId))
  // ).data() as Store;

  const snapshot = await getDocs(
    query(collection(db, "stores"), where("userId", "==", userId))
  );

  let store;

  snapshot.forEach((doc) => {
    store = doc.data() as Store;
    return;
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
