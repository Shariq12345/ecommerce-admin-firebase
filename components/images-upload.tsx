"use client";

import React, { useEffect, useState } from "react";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { PuffLoader } from "react-spinners";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "@/lib/firebase";
import toast from "react-hot-toast";

interface ImagesUploadProps {
  disabled?: boolean;
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImagesUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
}: ImagesUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    setLoading(true);

    if (files.length > 0) {
      const urls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = ref(
          storage,
          `Images/products/${Date.now()}-${file.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, file, {
          contentType: file.type,
        });

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
          },
          (error) => {
            toast.error("Failed to upload image");
            setLoading(false);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            urls.push(downloadURL);

            if (urls.length === files.length) {
              setLoading(false);
              onChange([...value, ...urls]);
            }
          }
        );
      }
    }
  };

  const onDelete = (url: string) => {
    const newValue = value.filter((v) => v !== url);
    onRemove(url);
    onChange(newValue);
    deleteObject(ref(storage, url)).then(() => {
      toast.success("Image deleted successfully");
    });
  };

  return (
    <div>
      {value && value.length > 0 ? (
        <>
          <div className="mb-4 flex items-center gap-4">
            {value.map((url) => (
              <div
                className="relative w-52 h-52 rounded-md overflow-hidden"
                key={url}
              >
                <Image
                  src={url}
                  fill
                  className="object-cover"
                  alt="Product Image"
                />
                <div className="absolute z-10 top-2 right-2">
                  <Button
                    onClick={() => onDelete(url)}
                    variant={"destructive"}
                    size={"icon"}
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="w-52 h-52 rounded-md overflow-hidden border border-dashed border-gray-200 flex items-center justify-center flex-col gap-3">
          {isLoading ? (
            <>
              <PuffLoader />
              <p>{`${progress.toFixed(2)}%`}</p>
            </>
          ) : (
            <>
              <label>
                <div className="w-full h-full flex flex-col gap-2 items-center cursor-pointer">
                  <ImagePlus className="size-4" />
                  <p>Upload Image</p>
                </div>
                <input
                  type="file"
                  onChange={onUpload}
                  accept="image/*"
                  className="w-0 h-0"
                  multiple
                />
              </label>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImagesUpload;
