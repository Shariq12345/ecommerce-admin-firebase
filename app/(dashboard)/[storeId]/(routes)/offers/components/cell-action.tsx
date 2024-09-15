"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OfferColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import AlertModal from "@/components/modals/alert-modal";

type CellActionProps = {
  data: OfferColumn;
};

export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Offer Copied");
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/offers/${data.id}`);
      toast.success("Offer deleted.");
      router.refresh();
    } catch (error) {
      toast.error("Please try again.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete()}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
          <DropdownMenuItem
            className="cursor"
            onClick={() => router.push(`/${params.storeId}/offers/${data.id}`)}
          >
            <Edit className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor" onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 size-4" />
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor" onClick={() => setOpen(true)}>
            <Trash className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
