// API кабінету продавця.
// Ендпоінтів продавця на бэку поки немає — працюємо на моках у будь-якому режимі.
// Коли бэк їх додасть: DTO -> types/api.ts, мапери -> mappers.ts, тут гілка `if (!USE_MOCKS)`.

import type {
  SellerOrder,
  SellerOrderFilter,
  SellerOrderStatus,
  SellerProduct,
  SellerProductFilter,
  SellerStats,
  SellerStore,
} from "../../types/seller";
import { sellerOrders, sellerProducts, sellerStore } from "../../data/seller";

const FAKE_DELAY_MS = 300;
const LOW_STOCK_LIMIT = 5;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), FAKE_DELAY_MS));
}

// Робочі копії моків: зміни статусів живуть до перезавантаження сторінки
let products: SellerProduct[] = sellerProducts.map((p) => ({ ...p }));
let orders: SellerOrder[] = sellerOrders.map((o) => ({ ...o, items: [...o.items] }));

function matchesSearch(search: string | undefined, ...fields: string[]): boolean {
  const query = search?.trim().toLowerCase();
  if (!query) return true;
  return fields.some((field) => field.toLowerCase().includes(query));
}

export async function getSellerStore(): Promise<SellerStore> {
  return delay({ ...sellerStore });
}

export async function getSellerStats(): Promise<SellerStats> {
  const completed = orders.filter((o) => o.status !== "cancelled");
  return delay({
    revenue: completed.reduce((sum, o) => sum + o.total, 0),
    ordersCount: orders.length,
    newOrdersCount: orders.filter((o) => o.status === "new").length,
    activeProductsCount: products.filter((p) => p.status === "active").length,
    lowStockCount: products.filter((p) => p.status === "active" && p.stock <= LOW_STOCK_LIMIT).length,
  });
}

export async function getSellerProducts(filter: SellerProductFilter = {}): Promise<SellerProduct[]> {
  const { status = "all", search } = filter;
  const result = products
    .filter((p) => status === "all" || p.status === status)
    .filter((p) => matchesSearch(search, p.title, p.sku))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return delay(result);
}

export async function getSellerOrders(filter: SellerOrderFilter = {}): Promise<SellerOrder[]> {
  const { status = "all", search } = filter;
  const result = orders
    .filter((o) => status === "all" || o.status === status)
    .filter((o) =>
      matchesSearch(search, o.number, o.customerName, ...o.items.map((item) => item.title))
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return delay(result);
}

export async function getSellerOrderById(id: string): Promise<SellerOrder | null> {
  return delay(orders.find((o) => o.id === id) ?? null);
}

export async function updateSellerOrderStatus(
  id: string,
  status: SellerOrderStatus
): Promise<SellerOrder> {
  const order = orders.find((o) => o.id === id);
  if (!order) throw new Error("Замовлення не знайдено");
  const updated: SellerOrder = { ...order, status };
  orders = orders.map((o) => (o.id === id ? updated : o));
  return delay(updated);
}

export async function updateSellerProductStock(id: string, stock: number): Promise<SellerProduct> {
  const product = products.find((p) => p.id === id);
  if (!product) throw new Error("Товар не знайдено");
  const updated: SellerProduct = {
    ...product,
    stock: Math.max(0, Math.floor(stock)),
    updatedAt: new Date().toISOString(),
  };
  products = products.map((p) => (p.id === id ? updated : p));
  return delay(updated);
}