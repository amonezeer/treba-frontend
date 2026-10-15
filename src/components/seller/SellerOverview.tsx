"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SellerOrder, SellerStats, SellerStore } from "../../types/seller";
import { getSellerOrders, getSellerStats, getSellerStore } from "../../lib/api/seller";
import { formatDate, formatDateTime, formatPrice, pluralize } from "../../lib/format";
import { orderStatusLabel, orderStatusTone } from "../../lib/sellerStatus";
import EmptyState from "../account/EmptyState";
import StatusBadge from "./StatusBadge";
import styles from "./SellerOverview.module.css";

const RECENT_ORDERS_COUNT = 4;

type OverviewData = {
  store: SellerStore;
  stats: SellerStats;
  recentOrders: SellerOrder[];
};

// Головна сторінка кабінету продавця: магазин, показники, останні замовлення
export default function SellerOverview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    Promise.all([getSellerStore(), getSellerStats(), getSellerOrders()])
      .then(([store, stats, orders]) => {
        if (isCancelled) return;
        setData({ store, stats, recentOrders: orders.slice(0, RECENT_ORDERS_COUNT) });
      })
      .catch(() => {
        if (!isCancelled) setHasError(true);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  if (hasError) {
    return (
      <EmptyState
        icon="/icons/return.svg"
        title="Не вдалося завантажити дані"
        subtitle="Оновіть сторінку або спробуйте пізніше"
      />
    );
  }

  if (!data) return <OverviewSkeleton />;

  const { store, stats, recentOrders } = data;

  return (
    <>
      <section className={styles.storeCard}>
        <span className={styles.storeLogo}>
          <img src={store.logo ?? "/icons/shop.svg"} alt="" />
        </span>
        <div className={styles.storeInfo}>
          <p className={styles.storeName}>{store.name}</p>
          <p className={styles.storeMeta}>{store.legalName}</p>
        </div>
        <div className={styles.storeRating}>
          <span className={styles.ratingValue}>
            <span className={styles.ratingStar} aria-hidden="true">★</span>
            {store.rating.toFixed(1)}
          </span>
          <span className={styles.storeMeta}>
            {store.reviewsCount} {pluralize(store.reviewsCount, ["відгук", "відгуки", "відгуків"])}
          </span>
        </div>
        <p className={styles.storeSince}>На Treba з {formatDate(store.registeredAt)}</p>
      </section>

      <section className={styles.statsGrid} aria-label="Показники магазину">
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Виручка</p>
          <p className={styles.statValue}>{formatPrice(stats.revenue)} ₴</p>
          <p className={styles.statHint}>без скасованих замовлень</p>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Замовлення</p>
          <p className={styles.statValue}>{stats.ordersCount}</p>
          <p className={styles.statHint}>за весь час</p>
        </div>

        <Link href="/seller/orders" className={`${styles.statCard} ${styles.statCardAccent}`}>
          <p className={styles.statLabel}>Нові замовлення</p>
          <p className={styles.statValue}>{stats.newOrdersCount}</p>
          <p className={styles.statHint}>очікують обробки →</p>
        </Link>

        <Link href="/seller/products" className={styles.statCard}>
          <p className={styles.statLabel}>Активні товари</p>
          <p className={styles.statValue}>{stats.activeProductsCount}</p>
          <p className={styles.statHint}>у продажу на сайті</p>
        </Link>
      </section>

      {stats.lowStockCount > 0 && (
        <Link href="/seller/products" className={styles.alert}>
          <span className={styles.alertIcon} aria-hidden="true">!</span>
          <span className={styles.alertText}>
            {stats.lowStockCount}{" "}
            {pluralize(stats.lowStockCount, ["товар закінчується", "товари закінчуються", "товарів закінчуються"])}{" "}
            на складі — поповніть залишки, щоб не втратити продажі
          </span>
          <span className={styles.alertArrow} aria-hidden="true">→</span>
        </Link>
      )}

      <section className={styles.ordersSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Останні замовлення</h2>
          <Link href="/seller/orders" className={styles.sectionLink}>
            Усі замовлення
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className={styles.emptyText}>Замовлень поки немає</p>
        ) : (
          <ul className={styles.orderList}>
            {recentOrders.map((order) => {
              const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
              return (
                <li key={order.id}>
                  <Link href={`/seller/orders?order=${order.id}`} className={styles.orderRow}>
                    <span className={styles.orderThumb}>
                      {order.items[0]?.image && <img src={order.items[0].image} alt="" />}
                    </span>
                    <span className={styles.orderInfo}>
                      <span className={styles.orderNumber}>№ {order.number}</span>
                      <span className={styles.orderMeta}>
                        {formatDateTime(order.createdAt)} · {order.customerName}
                      </span>
                    </span>
                    <span className={styles.orderTotal}>
                      <span className={styles.orderPrice}>{formatPrice(order.total)} ₴</span>
                      <span className={styles.orderMeta}>
                        {itemsCount} {pluralize(itemsCount, ["товар", "товари", "товарів"])}
                      </span>
                    </span>
                    <span className={styles.orderStatus}>
                      <StatusBadge
                        label={orderStatusLabel[order.status]}
                        tone={orderStatusTone[order.status]}
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}

// Скелетон на час завантаження
function OverviewSkeleton() {
  return (
    <div className={styles.skeleton} aria-busy="true">
      <span className={styles.srOnly} role="status">
        Завантаження…
      </span>
      <div className={`${styles.block} ${styles.skeletonStore}`} />
      <div className={styles.statsGrid}>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className={`${styles.block} ${styles.skeletonStat}`} />
        ))}
      </div>
      <div className={`${styles.block} ${styles.skeletonList}`} />
    </div>
  );
}