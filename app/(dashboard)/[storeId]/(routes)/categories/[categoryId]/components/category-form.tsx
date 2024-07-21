"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Billboards, Categories } from "@/types/types";
import AlertModal from "@/components/modals/alert-modal";

type Props = {
  initialData: Categories | null;
  billboards: Billboards[];
};

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;

const CategoryForm = ({ initialData, billboards }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const title = initialData ? "Edit Category" : "Create Category";
  const description = initialData
    ? "Edit your category"
    : "Create a new category";
  const toastMessage = initialData ? "Category updated." : "Category created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      const { billboardId: formBillId } = form.getValues();
      const matchBillboard = billboards.find(
        (billboard) => billboard.id === formBillId
      );
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          {
            ...data,
            billboardLabel: matchBillboard?.label,
          }
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, {
          ...data,
          billboardLabel: matchBillboard?.label,
        });
      }
      router.refresh();
      router.push(`/${params.storeId}/categories`);
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
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      router.push(`/${params.storeId}/categories`);
      toast.success("Category deleted.");
      router.refresh();
    } catch (error) {
      toast.error("Make sure to remove all products in this category first.");
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
            Delete Category
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
                      placeholder="Category Name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default CategoryForm;
