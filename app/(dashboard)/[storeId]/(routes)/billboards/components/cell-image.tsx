import React from "react";
import { BillboardColumn } from "./columns";
import Image from "next/image";

interface CellImageProps {
  imageUrl: string;
}

const CellImage = ({ imageUrl }: CellImageProps) => {
  return (
    <div className="overflow-hidden w-32 min-h-16 h-16 min-w-32 relative rounded-md shadow-md">
      <Image
        src={imageUrl}
        alt="Billboard Image"
        fill
        className="object-cover"
      />
    </div>
  );
};

export default CellImage;
