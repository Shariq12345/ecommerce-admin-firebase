import { Timestamp } from "firebase/firestore";

export interface Store {
  id: string;
  name: string;
  userId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Billboards {
  id: string;
  label: string;
  imageUrl: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Categories {
  id: string;
  name: string;
  billboardId: string;
  billboardLabel: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Weights {
  id: string;
  name: string;
  value: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Flavors {
  id: string;
  name: string;
  value: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  description?: string;
  images: { url: string }[];
  isFeatured: boolean;
  isArchived: boolean;
  category: string;
  weight: string;
  flavor: string;

  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Order {
  id: string;
  isPaid: boolean;
  phone: string;
  orderItems: Product[];
  address: string;
  order_status: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
