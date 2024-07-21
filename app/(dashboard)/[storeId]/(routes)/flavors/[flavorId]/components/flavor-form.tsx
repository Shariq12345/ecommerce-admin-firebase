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
import { Flavors } from "@/types/types";
import AlertModal from "@/components/modals/alert-modal";

type Props = {
  initialData: Flavors | null;
};

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: "Please enter a valid hex code.",
  }),
});

type FlavorFormValues = z.infer<typeof formSchema>;

const FlavorForm = ({ initialData }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const title = initialData ? "Edit Flavor" : "Create Flavor";
  const description = initialData ? "Edit a flavor" : "Create a new flavor";
  const toastMessage = initialData ? "Flavor updated." : "Flavor created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<FlavorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: FlavorFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/flavors/${params.flavorId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/flavors`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/flavors`);
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
      await axios.delete(`/api/${params.storeId}/flavors/${params.flavorId}`);
      router.push(`/${params.storeId}/flavors`);
      toast.success("Flavor deleted.");
      router.refresh();
    } catch (error) {
      toast.error("Make sure to remove all products using this flavor.");
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
            Delete Flavor
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
                      placeholder="Flavor Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="Enter Flavor Color"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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

export default FlavorForm;
