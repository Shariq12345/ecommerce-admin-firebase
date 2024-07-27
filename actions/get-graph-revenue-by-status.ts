import { db } from "@/lib/firebase";
import { Order } from "@/types/types";
import { collection, doc, getDocs } from "firebase/firestore";

interface GraphData {
  name: string;
  total: number;
}

export const getPaymentStatusRevenue = async (storeId: string) => {
  const ordersData = (
    await getDocs(collection(doc(db, "stores", storeId), "orders"))
  ).docs.map((doc) => doc.data()) as Order[];

  const statusRevenue: { [key: string]: number } = {};

  for (const order of ordersData) {
    const status = order.isPaid ? "Paid" : "Not Paid";

    if (status) {
      let revenueForOrder = 0;

      for (const item of order.orderItems) {
        if (item.quantity !== undefined) {
          revenueForOrder += item.price * item.quantity;
        } else {
          revenueForOrder += item.price;
        }
      }

      statusRevenue[status] = (statusRevenue[status] || 0) + revenueForOrder;
    }
  }

  const statusMap: { [key: string]: number } = {
    Paid: 0,
    "Not Paid": 1,
  };

  const graphData: GraphData[] = Object.keys(statusMap).map((statusName) => ({
    name: statusName,
    total: statusRevenue[statusName] || 0,
  }));

  return graphData;
};
