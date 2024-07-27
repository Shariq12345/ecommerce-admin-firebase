import { db } from "@/lib/firebase";
import { Order } from "@/types/types";
import { collection, doc, getDocs } from "firebase/firestore";

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async (storeId: string) => {
  const ordersData = (
    await getDocs(collection(doc(db, "stores", storeId), "orders"))
  ).docs.map((doc) => doc.data()) as Order[];

  const paidOrders = ordersData.filter((order) => order.isPaid);

  const monthlyRevenue: { [key: string]: number } = {};

  for (const order of paidOrders) {
    const month = order.createdAt
      ?.toDate()
      .toLocaleDateString("en-IN", { month: "short" });

    if (month) {
      let revenueForOrder = 0;

      for (const item of order.orderItems) {
        if (item.quantity !== undefined) {
          revenueForOrder += item.price * item.quantity;
        } else {
          revenueForOrder += item.price;
        }
      }
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
    }
  }

  const data: { [key: string]: number } = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const graphData: GraphData[] = Object.keys(data).map((month) => ({
    name: month,
    total: monthlyRevenue[month] || 0,
  }));

  return graphData;
};
