// Типи кабінету продавця.
// Статуси товару повторюють ApiProductStatus бэка (див. types/api.ts) у нижньому регістрі.

export type SellerProductStatus =
  | "draft"
  | "moderation"
  | "active"
  | "rejected"
  | "archived";

export type SellerOrderStatus =
  | "new"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

/** Магазин продавця (на бэку — store). */
export type SellerStore = {
  id: string;
  name: string;
  legalName: string;
  logo?: string;
  rating: number;
  reviewsCount: number;
  registeredAt: string; // ISO-дата
};

/** Товар у кабінеті продавця: ціни — числа, як на бэку. */
export type SellerProduct = {
  id: string;
  title: string;
  sku: string;
  image?: string;
  categoryName: string;
  price: number;
  oldPrice?: number;
  stock: number;
  soldCount: number;
  status: SellerProductStatus;
  updatedAt: string; // ISO-дата
};

export type SellerOrderItem = {
  productId: string;
  title: string;
  image?: string;
  price: number;
  quantity: number;
};

export type SellerOrder = {
  id: string;
  number: string;
  createdAt: string; // ISO-дата
  status: SellerOrderStatus;
  customerName: string;
  customerPhone: string;
  city: string;
  deliveryMethod: string;
  paymentMethod: string;
  isPaid: boolean;
  items: SellerOrderItem[];
  total: number;
};

/** Зведені показники для головної сторінки кабінету. */
export type SellerStats = {
  revenue: number;
  ordersCount: number;
  newOrdersCount: number;
  activeProductsCount: number;
  lowStockCount: number;
};

export type SellerProductFilter = {
  status?: SellerProductStatus | "all";
  search?: string;
};

export type SellerOrderFilter = {
  status?: SellerOrderStatus | "all";
  search?: string;
};