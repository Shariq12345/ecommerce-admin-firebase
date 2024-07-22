"use client";

import React from "react";
import { columns, WeightColumn } from "./columns";
import { useParams, useRouter } from "next/navigation";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/components/data-table";
import ApiList from "@/components/api-list";

type Props = {
  data: WeightColumn[];
};

const WeightClient = ({ data }: Props) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Weights (${data.length})`}
          description="Manage weights for your store."
        />
        <Button onClick={() => router.push(`/${params.storeId}/weights/new`)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for Weight" />
      <Separator />
      <ApiList entityName="weights" entityIdName="weightId" />
    </>
  );
};

export default WeightClient;
