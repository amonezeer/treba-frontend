"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { SellerProduct, SellerProductStatus } from "../../types/seller";
import { getSellerProducts, updateSellerProductStock } from "../../lib/api/seller";
import { formatDate, formatPrice, pluralize } from "../../lib/format";
import { productStatusLabel, productStatusTone } from "../../lib/sellerStatus";
import EmptyState from "../account/EmptyState";
import StatusBadge from "./StatusBadge";
import SellerStockInput from "./SellerStockInput";
import StatusTabs, { type StatusTabOption } from "./StatusTabs";
import SearchField from "./SearchField";
import styles from "./SellerProducts.module.css";

const LOW_STOCK_LIMIT = 5;

type StatusTab = SellerProductStatus | "all";

const statusTabs: StatusTabOption<StatusTab>[] = [
  { value: "all", label: "Усі" },
  { value: "active", label: "Активні" },
  { value: "moderation", label: "На модерації" },
  { value: "draft", label: "Чернетки" },
  { value: "rejected", label: "Відхилені" },
  { value: "archived", label: "В архіві" },
];

// Список товарів продавця: пошук, фільтр за статусом, редагування залишків
export default function SellerProducts() {
  const [products, setProducts] = useState<SellerProduct[] | null>(null);
  const [hasError, setHasError] = useState(false);
  const [status, setStatus] = useState<StatusTab>("all");
  const [search, setSearch] = useState("");
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    // Завантажуємо всі товари один раз: лічильники вкладок рахуються на фронті
    getSellerProducts()
      .then((result) => {
        if (!isCancelled) setProducts(result);
      })
      .catch(() => {
        if (!isCancelled) setHasError(true);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const result: Record<StatusTab, number> = {
      all: 0,
      active: 0,
      moderation: 0,
      draft: 0,
      rejected: 0,
      archived: 0,
    };
    for (const product of products ?? []) {
      result.all += 1;
      result[product.status] += 1;
    }
    return result;
  }, [products]);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (products ?? []).filter((product) => {
      if (status !== "all" && product.status !== status) return false;
      // як і на «Огляді»: закінчуються лише активні товари
      if (onlyLowStock && (product.status !== "active" || product.stock > LOW_STOCK_LIMIT)) {
        return false;
      }
      if (!query) return true;
      return (
        product.title.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
      );
    });
  }, [products, status, search, onlyLowStock]);

  async function handleStockSave(id: string, stock: number) {
    setSaveError(null);
    setSavingIds((prev) => [...prev, id]);
    try {
      const updated = await updateSellerProductStock(id, stock);
      setProducts((prev) => prev?.map((p) => (p.id === id ? updated : p)) ?? prev);
    } catch {
      setSaveError("Не вдалося зберегти залишок. Спробуйте ще раз.");
    } finally {
      setSavingIds((prev) => prev.filter((savingId) => savingId !== id));
    }
  }

  if (hasError) {
    return (
      <EmptyState
        icon="/icons/return.svg"
        title="Не вдалося завантажити товари"
        subtitle="Оновіть сторінку або спробуйте пізніше"
      />
    );
  }

  if (!products) {
    return (
      <div className={styles.skeleton} aria-busy="true">
        <span className={styles.srOnly} role="status">
          Завантаження…
        </span>
        <div className={`${styles.block} ${styles.skeletonToolbar}`} />
        <div className={`${styles.block} ${styles.skeletonList}`} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon="/icons/catalog.svg"
        title="Товарів ще немає"
        subtitle="Додані товари з'являться тут разом зі статусами та залишками"
      />
    );
  }

  return (
    <>
      <div className={styles.toolbar}>
        <SearchField
          value={search}
          placeholder="Пошук за назвою або кодом товару"
          onChange={setSearch}
        />

        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={onlyLowStock}
            onChange={(e) => setOnlyLowStock(e.target.checked)}
          />
          Активні, що закінчуються (≤ {LOW_STOCK_LIMIT} шт.)
        </label>
      </div>

      <StatusTabs
        tabs={statusTabs}
        value={status}
        counts={counts}
        ariaLabel="Статус товару"
        onChange={setStatus}
      />

      {saveError && (
        <p className={styles.saveError} role="alert">
          {saveError}
        </p>
      )}

      <section className={styles.list}>
        <div className={styles.listHeader} aria-hidden="true">
          <span>Товар</span>
          <span>Ціна</span>
          <span>Залишок</span>
          <span>Продано</span>
          <span>Статус</span>
        </div>

        {visibleProducts.length === 0 ? (
          <p className={styles.emptyText}>За цими умовами товарів не знайдено</p>
        ) : (
          <ul className={styles.rows}>
            {visibleProducts.map((product) => {
              const isLow = product.stock <= LOW_STOCK_LIMIT;
              return (
                <li key={product.id} className={styles.row}>
                  <div className={styles.product}>
                    <span className={styles.thumb}>
                      {product.image && <img src={product.image} alt="" />}
                    </span>
                    <div className={styles.productInfo}>
                      {product.status === "active" ? (
                        <Link href={`/product/${product.id}`} className={styles.productTitle}>
                          {product.title}
                        </Link>
                      ) : (
                        <span className={styles.productTitle}>{product.title}</span>
                      )}
                      <span className={styles.productMeta}>
                        Код {product.sku} · {product.categoryName}
                      </span>
                      <span className={styles.productMeta}>
                        Оновлено {formatDate(product.updatedAt)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.price}>
                    <span className={styles.cellLabel}>Ціна</span>
                    <span className={styles.priceValue}>{formatPrice(product.price)} ₴</span>
                    {product.oldPrice && (
                      <span className={styles.oldPrice}>{formatPrice(product.oldPrice)} ₴</span>
                    )}
                  </div>

                  <div className={styles.stock}>
                    <span className={styles.cellLabel}>Залишок</span>
                    {/* key: після збереження поле перемонтовується з новим значенням */}
                    <SellerStockInput
                      key={product.stock}
                      value={product.stock}
                      isSaving={savingIds.includes(product.id)}
                      onSave={(stock) => handleStockSave(product.id, stock)}
                    />
                    {isLow && (
                      <span className={product.stock === 0 ? styles.stockOut : styles.stockLow}>
                        {product.stock === 0 ? "Немає в наявності" : "Закінчується"}
                      </span>
                    )}
                  </div>

                  <div className={styles.sold}>
                    <span className={styles.cellLabel}>Продано</span>
                    <span>{product.soldCount} шт.</span>
                  </div>

                  <div className={styles.status}>
                    <StatusBadge
                      label={productStatusLabel[product.status]}
                      tone={productStatusTone[product.status]}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className={styles.footerNote}>
        Показано {visibleProducts.length} з {products.length}{" "}
        {pluralize(products.length, ["товару", "товарів", "товарів"])}
      </p>
    </>
  );
}