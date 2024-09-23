"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ReviewColumn = {
  id: string;
  content: string;
  rating: number;
  emailAddress: string;
  productId: string;
  createdAt: string;
};

export const columns: ColumnDef<ReviewColumn>[] = [
  {
    accessorKey: "id",
    header: "Review Id",
  },
  {
    accessorKey: "productId",
    header: "Product Id",
  },
  {
    accessorKey: "content",
    header: "Comment",
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    accessorKey: "emailAddress",
    header: "Email Address",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
