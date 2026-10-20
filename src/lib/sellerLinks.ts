import type { SellerProductsSort } from "../types/seller";

export const SELLER_SORT_OPTIONS: { value: SellerProductsSort; label: string }[] = [
  { value: "popular", label: "За рейтингом" },
  { value: "priceAsc", label: "Від дешевих до дорогих" },
  { value: "priceDesc", label: "Від дорогих до дешевих" },
];

export const DEFAULT_SELLER_SORT: SellerProductsSort = "popular";

/** Строка из адреса -> допустимая сортировка (мусор -> по умолчанию). */
export function parseSellerSort(value: string | undefined): SellerProductsSort {
  return SELLER_SORT_OPTIONS.some((option) => option.value === value)
    ? (value as SellerProductsSort)
    : DEFAULT_SELLER_SORT;
}

type SellerProductsParams = {
  category?: string;
  sort?: SellerProductsSort;
  page?: number;
};

/**
 * Адрес вкладки «Товари продавця» с фильтрами:
 * /seller/technodim?category=appliances&sort=priceAsc&page=2.
 * Значения по умолчанию в адрес не пишем — ссылки короче.
 */
export function sellerProductsHref(sellerId: string, params: SellerProductsParams = {}): string {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.sort && params.sort !== DEFAULT_SELLER_SORT) query.set("sort", params.sort);
  if (params.page && params.page > 1) query.set("page", String(params.page));

  const search = query.toString();
  return `/seller/${encodeURIComponent(sellerId)}${search ? `?${search}` : ""}`;
}