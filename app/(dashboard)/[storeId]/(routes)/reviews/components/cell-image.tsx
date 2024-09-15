"use client";

import React from "react";
import Image from "next/image";

interface CellImageProps {
  data: string[];
}

const CellImage = ({ data }: CellImageProps) => {
  return (
    <>
      {data.map((url, index) => (
        <div
          key={index}
          className="flex items-center justify-center overflow-hidden w-16 h-16 min-h-16 min-w-16 aspect-square rounded-md relative"
        >
          <Image
            src={url}
            alt="Product Image"
            fill
            className="object-contain"
          />
        </div>
      ))}
    </>
  );
};

export default CellImage;
