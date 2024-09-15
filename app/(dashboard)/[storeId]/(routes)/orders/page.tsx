import React from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Order } from "@/types/types";
import { OrderColumn } from "./components/columns";
import { format } from "date-fns";
import WeightClient from "./components/client";
import { formatter } from "@/lib/utils";
import OrderClient from "./components/client";

type Props = {
  params: {
    storeId: string;
  };
};

const OrdersPage = async ({ params }: Props) => {
  const orderData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "orders"))
  ).docs.map((doc) => doc.data()) as Order[];

  const formattedOrders: OrderColumn[] = orderData.map((item) => ({
    id: item.id,
    isPaid: item.isPaid,
    phone: item.phone,
    address: item.address,
    products: item.orderItems.map((item) => item.name).join(","),
    order_status: item.order_status,
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        if (item && item.quantity !== undefined) {
          return total + Number(item.price * item.quantity);
        }
        return total;
      }, 0)
    ),
    images: item.orderItems.map((item) => item.images[0].url),
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
