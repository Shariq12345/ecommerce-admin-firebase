"use client";

import React from "react";
import { columns, OrderColumn } from "./columns";
import Heading from "@/components/Heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";

type Props = {
  data: OrderColumn[];
};

const OrderClient = ({ data }: Props) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders (${data.length})`}
          description="Manage orders for your store."
        />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  );
};

export default OrderClient;
