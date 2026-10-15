// Підписи та кольорові «тони» статусів кабінету продавця

import type { SellerOrderStatus, SellerProductStatus } from "../types/seller";

export type StatusTone = "success" | "warning" | "danger" | "neutral" | "accent";

export const productStatusLabel: Record<SellerProductStatus, string> = {
  active: "Активний",
  moderation: "На модерації",
  draft: "Чернетка",
  rejected: "Відхилено",
  archived: "В архіві",
};

export const productStatusTone: Record<SellerProductStatus, StatusTone> = {
  active: "success",
  moderation: "warning",
  draft: "neutral",
  rejected: "danger",
  archived: "neutral",
};

export const orderStatusLabel: Record<SellerOrderStatus, string> = {
  new: "Нове",
  processing: "Комплектується",
  shipped: "Відправлено",
  delivered: "Доставлено",
  cancelled: "Скасовано",
};

export const orderStatusTone: Record<SellerOrderStatus, StatusTone> = {
  new: "accent",
  processing: "warning",
  shipped: "neutral",
  delivered: "success",
  cancelled: "danger",
};

/** Наступний крок, який може зробити продавець із замовленням. */
export const nextOrderStatus: Partial<Record<SellerOrderStatus, SellerOrderStatus>> = {
  new: "processing",
  processing: "shipped",
  shipped: "delivered",
};