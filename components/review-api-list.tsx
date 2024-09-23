"use client";

import React from "react";
import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import ApiAlert from "./modals/api-alert";

type Props = {
  entityName: string;
  entityIdName: string;
};
// http://localhost:3001/api/rOle8NmT60ULVkFdrlQZ/reviews?productId=0WRCWfqyNtLOhgoLeeOI

const ReviewApiList = ({ entityIdName, entityName }: Props) => {
  const origin = useOrigin();
  const params = useParams();

  const baseUrl = `${origin}/api/${params.storeId}`;
  return (
    <>
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}?productId={${entityIdName}}`}
      />
      <ApiAlert
        title="POST"
        variant="admin"
        description={`${baseUrl}/${entityName}?productId={${entityIdName}}`}
      />
      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${baseUrl}/${entityName}?productId={${entityIdName}}`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
    </>
  );
};

export default ReviewApiList;
