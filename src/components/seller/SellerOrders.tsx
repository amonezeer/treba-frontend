"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SellerOrder, SellerOrderStatus } from "../../types/seller";
import { getSellerOrders, updateSellerOrderStatus } from "../../lib/api/seller";
import { formatDateTime, formatPrice, pluralize } from "../../lib/format";
import { nextOrderStatus, orderStatusLabel, orderStatusTone } from "../../lib/sellerStatus";
import EmptyState from "../account/EmptyState";
import StatusBadge from "./StatusBadge";
import StatusTabs, { type StatusTabOption } from "./StatusTabs";
import SearchField from "./SearchField";
import styles from "./SellerOrders.module.css";

type StatusTab = SellerOrderStatus | "all";

const statusTabs: StatusTabOption<StatusTab>[] = [
  { value: "all", label: "Усі" },
  { value: "new", label: "Нові" },
  { value: "processing", label: "Комплектуються" },
  { value: "shipped", label: "Відправлені" },
  { value: "delivered", label: "Доставлені" },
  { value: "cancelled", label: "Скасовані" },
];

// Підпис кнопки для переходу до наступного статусу
const nextActionLabel: Partial<Record<SellerOrderStatus, string>> = {
  new: "Прийняти в роботу",
  processing: "Відправити",
  shipped: "Позначити доставленим",
};

// Скасувати можна лише ще не відправлене замовлення
const cancellableStatuses: SellerOrderStatus[] = ["new", "processing"];

type SellerOrdersProps = {
  /** id замовлення, яке треба одразу розгорнути (з ?order= в адресі) */
  initialOrderId?: string;
};

// Замовлення покупців: фільтр за статусом, пошук, деталі та зміна статусу
export default function SellerOrders({ initialOrderId }: SellerOrdersProps) {
  const [orders, setOrders] = useState<SellerOrder[] | null>(null);
  const [hasError, setHasError] = useState(false);
  const [status, setStatus] = useState<StatusTab>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(initialOrderId ?? null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const initialRowRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    let isCancelled = false;

    getSellerOrders()
      .then((result) => {
        if (!isCancelled) setOrders(result);
      })
      .catch(() => {
        if (!isCancelled) setHasError(true);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Після завантаження прокручуємо до замовлення з адреси
  const isLoaded = orders !== null;
  useEffect(() => {
    if (isLoaded && initialOrderId) {
      initialRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoaded, initialOrderId]);

  const counts = useMemo(() => {
    const result: Record<StatusTab, number> = {
      all: 0,
      new: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    for (const order of orders ?? []) {
      result.all += 1;
      result[order.status] += 1;
    }
    return result;
  }, [orders]);

  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (orders ?? []).filter((order) => {
      if (status !== "all" && order.status !== status) return false;
      if (!query) return true;
      return [order.number, order.customerName, ...order.items.map((item) => item.title)].some(
        (field) => field.toLowerCase().includes(query)
      );
    });
  }, [orders, status, search]);

  async function changeStatus(id: string, nextStatus: SellerOrderStatus) {
    setActionError(null);
    setPendingId(id);
    try {
      const updated = await updateSellerOrderStatus(id, nextStatus);
      setOrders((prev) => prev?.map((o) => (o.id === id ? updated : o)) ?? prev);
      setConfirmCancelId(null);
    } catch {
      setActionError("Не вдалося змінити статус замовлення. Спробуйте ще раз.");
    } finally {
      setPendingId(null);
    }
  }

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
    setConfirmCancelId(null);
  }

  if (hasError) {
    return (
      <EmptyState
        icon="/icons/return.svg"
        title="Не вдалося завантажити замовлення"
        subtitle="Оновіть сторінку або спробуйте пізніше"
      />
    );
  }

  if (!orders) {
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

  if (orders.length === 0) {
    return (
      <EmptyState
        icon="/icons/box.svg"
        title="Замовлень ще немає"
        subtitle="Коли покупці оформлять замовлення на ваші товари, вони з'являться тут"
      />
    );
  }

  return (
    <>
      <div className={styles.toolbar}>
        <SearchField
          value={search}
          placeholder="Пошук за номером, покупцем або товаром"
          onChange={setSearch}
        />
      </div>

      <StatusTabs
        tabs={statusTabs}
        value={status}
        counts={counts}
        ariaLabel="Статус замовлення"
        onChange={setStatus}
      />

      {actionError && (
        <p className={styles.actionError} role="alert">
          {actionError}
        </p>
      )}

      {visibleOrders.length === 0 ? (
        <p className={styles.emptyText}>За цими умовами замовлень не знайдено</p>
      ) : (
        <ul className={styles.list}>
          {visibleOrders.map((order) => {
            const isExpanded = expandedId === order.id;
            const isPending = pendingId === order.id;
            const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
            const next = nextOrderStatus[order.status];
            const canCancel = cancellableStatuses.includes(order.status);
            const detailsId = `order-details-${order.id}`;

            return (
              <li
                key={order.id}
                ref={order.id === initialOrderId ? initialRowRef : undefined}
                className={`${styles.card} ${isExpanded ? styles.cardExpanded : ""}`}
              >
                <button
                  type="button"
                  className={styles.summary}
                  aria-expanded={isExpanded}
                  aria-controls={detailsId}
                  onClick={() => toggle(order.id)}
                >
                  <span className={styles.summaryMain}>
                    <span className={styles.orderNumber}>№ {order.number}</span>
                    <span className={styles.orderMeta}>
                      {formatDateTime(order.createdAt)} · {order.customerName}, {order.city}
                    </span>
                  </span>
                  <span className={styles.summaryTotal}>
                    <span className={styles.orderPrice}>{formatPrice(order.total)} ₴</span>
                    <span className={styles.orderMeta}>
                      {itemsCount} {pluralize(itemsCount, ["товар", "товари", "товарів"])}
                    </span>
                  </span>
                  <span className={styles.summaryStatus}>
                    <StatusBadge
                      label={orderStatusLabel[order.status]}
                      tone={orderStatusTone[order.status]}
                    />
                  </span>
                  <svg
                    className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ""}`}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 6l5 5 5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {isExpanded && (
                  <div id={detailsId} className={styles.details}>
                    <div className={styles.detailsGrid}>
                      <ul className={styles.items}>
                        {order.items.map((item) => (
                          <li key={item.productId} className={styles.item}>
                            <span className={styles.itemThumb}>
                              {item.image && <img src={item.image} alt="" />}
                            </span>
                            <span className={styles.itemTitle}>{item.title}</span>
                            <span className={styles.itemQty}>
                              {item.quantity} × {formatPrice(item.price)} ₴
                            </span>
                            <span className={styles.itemSum}>
                              {formatPrice(item.quantity * item.price)} ₴
                            </span>
                          </li>
                        ))}
                        <li className={styles.itemsTotal}>
                          <span>Разом</span>
                          <span>{formatPrice(order.total)} ₴</span>
                        </li>
                      </ul>

                      <dl className={styles.info}>
                        <div className={styles.infoBlock}>
                          <dt>Покупець</dt>
                          <dd>{order.customerName}</dd>
                          <dd>
                            <a
                              href={`tel:${order.customerPhone.replace(/\s/g, "")}`}
                              className={styles.phone}
                            >
                              {order.customerPhone}
                            </a>
                          </dd>
                        </div>
                        <div className={styles.infoBlock}>
                          <dt>Доставка</dt>
                          <dd>{order.city}</dd>
                          <dd>{order.deliveryMethod}</dd>
                        </div>
                        <div className={styles.infoBlock}>
                          <dt>Оплата</dt>
                          <dd>{order.paymentMethod}</dd>
                          <dd>
                            <StatusBadge
                              label={order.isPaid ? "Оплачено" : "Не оплачено"}
                              tone={order.isPaid ? "success" : "warning"}
                            />
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {(next || canCancel) && (
                      <div className={styles.actions}>
                        {confirmCancelId === order.id ? (
                          <>
                            <span className={styles.confirmText}>Скасувати замовлення?</span>
                            <button
                              type="button"
                              className={styles.dangerButton}
                              disabled={isPending}
                              onClick={() => changeStatus(order.id, "cancelled")}
                            >
                              Так, скасувати
                            </button>
                            <button
                              type="button"
                              className={styles.secondaryButton}
                              disabled={isPending}
                              onClick={() => setConfirmCancelId(null)}
                            >
                              Ні
                            </button>
                          </>
                        ) : (
                          <>
                            {next && (
                              <button
                                type="button"
                                className={styles.primaryButton}
                                disabled={isPending}
                                onClick={() => changeStatus(order.id, next)}
                              >
                                {isPending ? "Зберігаємо…" : nextActionLabel[order.status]}
                              </button>
                            )}
                            {canCancel && (
                              <button
                                type="button"
                                className={styles.secondaryButton}
                                disabled={isPending}
                                onClick={() => setConfirmCancelId(order.id)}
                              >
                                Скасувати
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}