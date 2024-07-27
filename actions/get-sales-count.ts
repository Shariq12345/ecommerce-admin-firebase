import { db } from "@/lib/firebase";
import { collection, doc, getDocs } from "firebase/firestore";

export const getSalesCount = async (storeId: string) => {
  const ordersData = await getDocs(
    collection(doc(db, "stores", storeId), "orders")
  );

  const count = ordersData.size;

  return count;
};
