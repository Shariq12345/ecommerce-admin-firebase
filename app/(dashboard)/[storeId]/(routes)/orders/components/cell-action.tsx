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
import {
  Truck,
  CheckCircle,
  XCircle,
  Copy,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import AlertModal from "@/components/modals/alert-modal";
import { OrderColumn } from "./columns";

type CellActionProps = {
  data: OrderColumn;
};

export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Order Copied");
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/orders/${data.id}`);
      toast.success("Order deleted.");
      router.refresh();
    } catch (error) {
      toast.error("Somethig went wrong. Please try again.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onUpdate = async (data: any) => {
    try {
      setLoading(true);
      await axios.patch(`/api/${params.storeId}/orders/${data.id}`, data);
      router.push(`/${params.storeId}/orders`);
      toast.success("Order updated.");
      router.refresh();
    } catch (error) {
      toast.error("Somethig went wrong. Please try again.");
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
              onUpdate({ id: data.id, order_status: "Delivering" });
            }}
          >
            <Truck className="mr-2 size-4" />
            DELIVERING
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor"
            onClick={() => {
              onUpdate({ id: data.id, order_status: "Delivered" });
            }}
          >
            <CheckCircle className="mr-2 size-4" />
            DELIVERED
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor"
            onClick={() => {
              onUpdate({ id: data.id, order_status: "Cancelled" });
            }}
          >
            <XCircle className="mr-2 size-4" />
            CANCELLED
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
