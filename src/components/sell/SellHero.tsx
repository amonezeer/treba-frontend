"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { IconArrowRight, IconBag, IconCheck, IconStar } from "./SellIcons";
import styles from "./SellHero.module.css";

type LiveOrder = {
  product: string;
  city: string;
  price: string;
};

type WeekDay = {
  day: string;
  value: number; // высота столбика в процентах
};

// Демо-данные для иллюстрации панели продавца (не реальная статистика)
const LIVE_ORDERS: LiveOrder[] = [
  { product: "Зволожувач повітря", city: "Київ", price: "2 499 ₴" },
  { product: "Кросівки бігові", city: "Львів", price: "3 150 ₴" },
  { product: "Набір каструль", city: "Одеса", price: "1 870 ₴" },
  { product: "Навушники бездротові", city: "Дніпро", price: "1 299 ₴" },
];

const WEEK: WeekDay[] = [
  { day: "Пн", value: 38 },
  { day: "Вт", value: 52 },
  { day: "Ср", value: 45 },
  { day: "Чт", value: 64 },
  { day: "Пт", value: 58 },
  { day: "Сб", value: 80 },
  { day: "Нд", value: 96 },
];

const HIGHLIGHTS = ["Без абонплати", "Розгляд заявки за 1–3 дні", "Підтримка менеджера"];

const ORDER_INTERVAL_MS = 3200;

// Первый экран лендинга: на всю высоту окна (но не выше 980px)
export default function SellHero() {
  const [orderIndex, setOrderIndex] = useState(0);

  // Каждые несколько секунд показываем следующее «нове замовлення»
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const timer = window.setInterval(() => {
      setOrderIndex((current) => (current + 1) % LIVE_ORDERS.length);
    }, ORDER_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  const order = LIVE_ORDERS[orderIndex];

  return (
    <section className={styles.hero} aria-labelledby="sell-hero-title">
      <div className={styles.inner}>
        <div className={styles.content}>
          <span className={styles.badge}>
            <span className={styles.badgeDot} />
            TREBA для бізнесу
          </span>

          <h1 id="sell-hero-title" className={styles.title}>
            Продавайте на <span className={styles.accent}>TREBA</span> — покупці вже тут
          </h1>

          <p className={styles.lead}>
            Розмістіть свої товари на українському маркетплейсі. Ми даємо вітрину, потік
            покупців і зручну панель керування, а ви зосереджуєтесь на своєму продукті.
          </p>

          <div className={styles.actions}>
            <a href="#apply" className={styles.primary}>
              Стати продавцем
              <IconArrowRight size={20} className={styles.arrow} />
            </a>
            <a href="#calculator" className={styles.secondary}>
              Розрахувати дохід
            </a>
          </div>

          <ul className={styles.highlights}>
            {HIGHLIGHTS.map((item) => (
              <li key={item} className={styles.highlight}>
                <span className={styles.check}>
                  <IconCheck size={13} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Декоративная иллюстрация панели продавца */}
        <div className={styles.visual} aria-hidden="true">
          <div className={styles.dashboard}>
            <div className={styles.dashHead}>
              <div>
                <p className={styles.dashLabel}>Продажі за тиждень</p>
                <p className={styles.dashValue}>48 320 ₴</p>
              </div>
              <span className={styles.growth}>+24%</span>
            </div>

            <div className={styles.chart}>
              {WEEK.map((item, index) => (
                <div key={item.day} className={styles.barCol}>
                  <div className={styles.barTrack}>
                    <div
                      className={`${styles.bar} ${index === WEEK.length - 1 ? styles.barToday : ""}`}
                      style={{ "--bar": `${item.value}%`, "--i": index } as CSSProperties}
                    />
                  </div>
                  <span className={styles.dayLabel}>{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* key перезапускает анимацию появления при смене заказа */}
          <div key={orderIndex} className={styles.toast}>
            <span className={styles.toastIcon}>
              <IconBag size={22} />
            </span>
            <div className={styles.toastBody}>
              <p className={styles.toastTitle}>Нове замовлення</p>
              <p className={styles.toastText}>
                {order.product} · {order.city}
              </p>
            </div>
            <span className={styles.toastPrice}>{order.price}</span>
          </div>

          <div className={styles.rating}>
            <span className={styles.ratingIcon}>
              <IconStar size={20} />
            </span>
            <div>
              <p className={styles.ratingValue}>4,9</p>
              <p className={styles.ratingText}>рейтинг магазину</p>
            </div>
          </div>
        </div>
      </div>

      {/* Подсказка прокрутить вниз */}
      <div className={styles.scrollHint} aria-hidden="true">
        <span className={styles.mouse}>
          <span className={styles.wheel} />
        </span>
        <span className={styles.scrollText}>Гортайте вниз</span>
      </div>
    </section>
  );
}