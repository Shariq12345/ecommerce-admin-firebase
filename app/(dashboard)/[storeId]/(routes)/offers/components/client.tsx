"use client";

import React from "react";
import { columns, OfferColumn } from "./columns";
import { useParams, useRouter } from "next/navigation";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/components/data-table";
import ApiList from "@/components/api-list";

type Props = {
  data: OfferColumn[];
};

const OfferClient = ({ data }: Props) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Offers (${data.length})`}
          description="Manage offers for your store."
        />
        <Button onClick={() => router.push(`/${params.storeId}/offers/new`)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for Offer" />
      <Separator />
      <ApiList entityName="offers" entityIdName="offerId" />
    </>
  );
};

export default OfferClient;
