"use client";

import React from "react";
import { columns, ReviewColumn } from "./columns";
import { useParams, useRouter } from "next/navigation";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/components/data-table";
import ApiList from "@/components/api-list";
import ReviewApiList from "@/components/review-api-list";

type Props = {
  data: ReviewColumn[];
};

const ReviewClient = ({ data }: Props) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Reviews (${data.length})`}
          description="Manage reviews for your store."
        />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="rating" />
      <Heading title="API" description="API calls for Reviews" />
      <Separator />
      <ReviewApiList entityName="reviews" entityIdName="productId" />
    </>
  );
};

export default ReviewClient;
