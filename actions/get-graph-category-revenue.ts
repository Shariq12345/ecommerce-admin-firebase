import { db } from "@/lib/firebase";
import { Categories, Order } from "@/types/types";
import { collection, doc, getDocs } from "firebase/firestore";

interface GraphData {
  name: string;
  total: number;
}

export const getCategoryRevenue = async (storeId: string) => {
  const ordersData = (
    await getDocs(collection(doc(db, "stores", storeId), "orders"))
  ).docs.map((doc) => doc.data()) as Order[];

  const categories = (
    await getDocs(collection(doc(db, "stores", storeId), "categories"))
  ).docs.map((doc) => doc.data()) as Categories[];

  const categoryRevenue: { [key: string]: number } = {};

  for (const order of ordersData) {
    for (const item of order.orderItems) {
      const category = item.category;

      if (category) {
        let revenueForCategory = 0;

        if (item.quantity !== undefined) {
          revenueForCategory = item.quantity * item.price;
        } else {
          revenueForCategory = item.price;
        }

        categoryRevenue[category] =
          (categoryRevenue[category] || 0) + revenueForCategory;
      }
    }
  }

  for (const category of categories) {
    categoryRevenue[category.name] = categoryRevenue[category.name] || 0;
  }

  const graphData: GraphData[] = categories.map((category) => ({
    name: category.name,
    total: categoryRevenue[category.name],
  }));

  return graphData;
};
