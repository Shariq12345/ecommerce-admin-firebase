"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit3, Copy, MoreHorizontal, Trash } from "lucide-react";
import AlertModal from "@/components/modals/alert-modal";
import { ReviewColumn } from "./columns";

type CellActionProps = {
  data: ReviewColumn;
};

export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const { storeId, productId } = useParams(); // Get both storeId and productId
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Review ID Copied");
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${storeId}/products/${productId}/reviews/${data.id}`
      );
      toast.success("Review deleted.");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onUpdate = async (data: any) => {
    try {
      setLoading(true);
      await axios.patch(
        `/api/${storeId}/products/${productId}/reviews/${data.id}`,
        data
      );
      router.push(`/${storeId}/products/${productId}/reviews`);
      toast.success("Review updated.");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      router.refresh();
      setLoading(false);
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
          <DropdownMenuItem
            className="cursor"
            onClick={() => {
              onUpdate({ id: data.id, content: "Updated Review Content" }); // Adjust this to fit your update logic
            }}
          >
            <Edit3 className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor" onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 size-4" />
            Copy ID
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
