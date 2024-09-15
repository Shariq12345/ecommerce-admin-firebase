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
  discount?: number;

  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Review {
  id: string; // Unique review ID
  content: string; // Review content
  rating: number; // Rating given by the user (e.g., 1-5)
  userName: string; // Name of the user (could be stored to avoid querying users separately)
  emailAddress: string; // Email of the user
  productId: string; // ID of the product being reviewed
  createdAt?: Timestamp; // When the review was created
}

export interface Offers {
  id: string;
  name: string;
  code: string;
  discount: number;
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
