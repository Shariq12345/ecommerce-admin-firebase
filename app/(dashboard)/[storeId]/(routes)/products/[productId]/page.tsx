import React from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Categories, Flavors, Offers, Product, Weights } from "@/types/types";
import ProductForm from "./components/product-form";

type Props = {
  params: {
    productId: string;
    storeId: string;
  };
};

const ProductPage = async ({ params }: Props) => {
  const product = (await (
    await getDoc(
      doc(db, "stores", params.storeId, "products", params.productId)
    )
  ).data()) as Product;

  const category = (
    await getDocs(collection(doc(db, "stores", params.storeId), "categories"))
  ).docs.map((doc) => doc.data()) as Categories[];

  const weights = (
    await getDocs(collection(doc(db, "stores", params.storeId), "weights"))
  ).docs.map((doc) => doc.data()) as Weights[];

  const flavors = (
    await getDocs(collection(doc(db, "stores", params.storeId), "flavors"))
  ).docs.map((doc) => doc.data()) as Flavors[];

  const offers = (
    await getDocs(collection(doc(db, "stores", params.storeId), "offers"))
  ).docs.map((doc) => doc.data()) as Offers[];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <ProductForm
          initialData={product}
          categories={category}
          weights={weights}
          flavors={flavors}
        />
      </div>
    </div>
  );
};

export default ProductPage;
