import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ReviewColumn = {
  id: string;
  userId: string;
  rating: number;
  content: string;
  createdAt: string;
};

export const columns: ColumnDef<ReviewColumn>[] = [
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <p
        className={cn(
          "text-base font-semibold",
          row.original.rating >= 4
            ? "text-emerald-500"
            : row.original.rating >= 2
            ? "text-yellow-500"
            : "text-red-500"
        )}
      >
        {row.original.rating}
      </p>
    ),
  },
  {
    accessorKey: "content",
    header: "Review",
    cell: ({ row }) => <p>{row.original.content}</p>,
  },
  {
    accessorKey: "userId",
    header: "User ID",
    cell: ({ row }) => <p>{row.original.userId}</p>,
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
