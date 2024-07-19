import { db } from "@/lib/firebase";
import { Store } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

interface SetupLayoutProps {
  children: ReactNode;
}

const SetupLayout = async ({ children }: SetupLayoutProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const snapshot = await getDocs(
    query(collection(db, "stores"), where("userId", "==", userId))
  );

  let store = null as any;

  snapshot.forEach((doc) => {
    store = doc.data() as Store;
    return;
  });

  console.log(store);

  if (store) {
    redirect(`/${store?.id}`);
  }
  return <div>{children}</div>;
};

export default SetupLayout;
