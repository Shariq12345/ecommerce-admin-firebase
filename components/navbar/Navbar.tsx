import React from "react";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import MainNav from "./MainNav";
import { db } from "@/lib/firebase";
import StoreSwitcher from "./store-switcher";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Store } from "@/types/types";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const snapshot = await getDocs(
    query(collection(db, "stores"), where("userId", "==", userId))
  );

  let stores = [] as Store[];

  snapshot.forEach((doc) => {
    stores.push(doc.data() as Store);
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        {/* STORE SWITCHER */}
        <StoreSwitcher items={stores} />

        {/* ROUTES */}
        <MainNav className="mx-6" />

        <div className="ml-auto flex items-center space-x-4">
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
