"use client";
import React, { useState } from "react";
import { z } from "zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { Offers } from "@/types/types";
import AlertModal from "@/components/modals/alert-modal";

type Props = {
  initialData: Offers | null;
};

const formSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  discount: z.coerce.number().min(0),
});

type OfferFormValues = z.infer<typeof formSchema>;

const OfferForm = ({ initialData }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const title = initialData ? "Edit Offer" : "Create Offer";
  const description = initialData ? "Edit a offer" : "Create a new offer";
  const toastMessage = initialData ? "Offer updated." : "Offer created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      code: "",
      discount: 0,
    },
  });

  const onSubmit = async (data: OfferFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/offers/${params.offerId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/offers`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/offers`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/offers/${params.offerId}`);
      router.push(`/${params.storeId}/offers`);
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
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            onClick={() => setOpen(true)}
          >
            <Trash className="mr-2 size-4" />
            Delete Offer
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter Code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter Discount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default OfferForm;
