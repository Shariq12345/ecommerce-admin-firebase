"use client";

import React from "react";
import { columns, ReviewColumn } from "./columns";
import { useParams, useRouter } from "next/navigation";
import Heading from "@/components/Heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";

type Props = {
  data: ReviewColumn[];
};

const ReviewClient = ({ data }: Props) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Reviews (${data.length})`}
          description="View the reviews of the products."
        />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="rating" />
    </>
  );
};

export default ReviewClient;
