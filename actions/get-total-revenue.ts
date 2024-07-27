import { db } from "@/lib/firebase";
import { Order } from "@/types/types";
import { collection, getDocs } from "firebase/firestore";

export const getTotalRevenue = async (storeId: string) => {
  const orderData = (
    await getDocs(collection(db, "stores", storeId, "orders"))
  ).docs.map((doc) => doc.data()) as Order[];

  const paidOrders = orderData.filter((order) => order.isPaid);

  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      if (item.quantity !== undefined) {
        return orderSum + item.price * item.quantity;
      } else {
        return orderSum + item.price;
      }
    }, 0);
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
