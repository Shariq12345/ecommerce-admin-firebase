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

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const onUpload = async (e: any) => {
    const file = e.target.files[0];
    setLoading(true);

    const uploadTask = uploadBytesResumable(
      ref(storage, `Images/${Date.now()} - ${file.name}`),
      file,
      { contentType: file.type }
    );

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        toast.error(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          onChange(downloadUrl);
          setLoading(false);
        });
      }
    );
  };

  const onDelete = (url: string) => {
    onRemove(url);
    deleteObject(ref(storage, url)).then(() => {
      toast.success("Image Removed");
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
                  alt="Billboard Image"
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
        <div className="w-52 h-52 rounded-md overflow-hidden border border-dashed border-gray-200 flex items-cetner justify-center flex-col gap-3">
          {isLoading ? (
            <>
              <PuffLoader />
              <p>{`${progress.toFixed(2)}%`}</p>
            </>
          ) : (
            <>
              <label>
                <div className="w-full h-full flex flex-col gap-2 items-center justify-center cursor-pointer">
                  <ImagePlus className="size-4" />
                  <p>Upload Image</p>
                </div>
                <input
                  type="file"
                  onChange={onUpload}
                  accept="image/*"
                  className="w-0 h-0"
                />
              </label>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
