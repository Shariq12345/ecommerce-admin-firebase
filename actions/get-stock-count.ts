import { db } from "@/lib/firebase";
import { collection, doc, getDocs } from "firebase/firestore";

export const getStockCount = async (storeId: string) => {
  const stockCount = await getDocs(
    collection(doc(db, "stores", storeId), "products")
  );

  const count = stockCount.size;
  return count;
};
