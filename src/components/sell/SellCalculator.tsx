"use client";

import { useId, useState, type CSSProperties } from "react";
import type { SellCommissionCategory } from "../../types/sellLanding";
import { formatPrice, pluralize } from "../../lib/format";
import SellSection from "./SellSection";
import { IconArrowRight } from "./SellIcons";
import styles from "./SellCalculator.module.css";

type RangeConfig = {
  min: number;
  max: number;
  step: number;
  initial: number;
};

const PRICE: RangeConfig = { min: 100, max: 20000, step: 50, initial: 1500 };
const ORDERS: RangeConfig = { min: 1, max: 500, step: 1, initial: 60 };

function fillPercent(value: number, config: RangeConfig): number {
  return ((value - config.min) / (config.max - config.min)) * 100;
}

function formatOrders(count: number): string {
  return `${count} ${pluralize(count, ["замовлення", "замовлення", "замовлень"])}`;
}

type RangeFieldProps = {
  label: string;
  value: number;
  config: RangeConfig;
  format: (value: number) => string;
  onChange: (value: number) => void;
};

// Ползунок с подписью, текущим значением и границами
function RangeField({ label, value, config, format, onChange }: RangeFieldProps) {
  const inputId = useId();

  return (
    <div className={styles.field}>
      <div className={styles.fieldHead}>
        <label htmlFor={inputId} className={styles.fieldLabel}>
          {label}
        </label>
        <span className={styles.fieldValue}>{format(value)}</span>
      </div>

      <input
        id={inputId}
        type="range"
        className={styles.range}
        min={config.min}
        max={config.max}
        step={config.step}
        value={value}
        aria-valuetext={format(value)}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ "--fill": `${fillPercent(value, config)}%` } as CSSProperties}
      />

      <div className={styles.bounds} aria-hidden="true">
        <span>{format(config.min)}</span>
        <span>{format(config.max)}</span>
      </div>
    </div>
  );
}

type SellCalculatorProps = {
  categories: SellCommissionCategory[];
};

export default function SellCalculator({ categories }: SellCalculatorProps) {
  const groupName = useId();
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [price, setPrice] = useState(PRICE.initial);
  const [orders, setOrders] = useState(ORDERS.initial);

  const category = categories.find((item) => item.id === categoryId) ?? categories[0];
  const rate = category?.rate ?? 0;

  const turnover = price * orders;
  const commission = Math.round((turnover * rate) / 100);
  const income = turnover - commission;
  const incomeShare = turnover > 0 ? (income / turnover) * 100 : 0;

  return (
    <SellSection
      id="calculator"
      eyebrow="Калькулятор"
      title="Скільки ви зможете заробити"
      subtitle="Оберіть категорію, середню ціну та кількість замовлень — і побачите орієнтовний дохід."
      fullscreen
    >
      <div className={styles.layout}>
        {/* Параметры */}
        <div className={styles.controls}>
          <fieldset className={styles.fieldset}>
            <legend className={styles.fieldLabel}>Категорія товарів</legend>

            <div className={styles.chips}>
              {categories.map((item) => {
                const isActive = item.id === category?.id;
                return (
                  <label
                    key={item.id}
                    className={`${styles.chip} ${isActive ? styles.chipActive : ""}`}
                  >
                    <input
                      type="radio"
                      name={groupName}
                      value={item.id}
                      checked={isActive}
                      onChange={() => setCategoryId(item.id)}
                      className={styles.srOnly}
                    />
                    {item.label}
                    <span className={styles.chipRate}>{item.rate}%</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <RangeField
            label="Середня ціна товару"
            value={price}
            config={PRICE}
            format={(value) => `${formatPrice(value)} ₴`}
            onChange={setPrice}
          />

          <RangeField
            label="Замовлень на місяць"
            value={orders}
            config={ORDERS}
            format={formatOrders}
            onChange={setOrders}
          />
        </div>

        {/* Результат */}
        <div className={styles.result} aria-live="polite">
          <p className={styles.resultLabel}>Ваш дохід на місяць</p>
          {/* key перезапускает анимацию при каждом изменении суммы */}
          <p key={income} className={styles.resultValue}>
            {formatPrice(income)} ₴
          </p>

          <div className={styles.split} aria-hidden="true">
            <span className={styles.splitIncome} style={{ width: `${incomeShare}%` }} />
            <span className={styles.splitCommission} />
          </div>
          <div className={styles.legend} aria-hidden="true">
            <span className={styles.legendItem}>
              <span className={`${styles.dot} ${styles.dotIncome}`} />
              Ваш дохід
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.dot} ${styles.dotCommission}`} />
              Комісія
            </span>
          </div>

          <dl className={styles.rows}>
            <div className={styles.row}>
              <dt>Оборот</dt>
              <dd>{formatPrice(turnover)} ₴</dd>
            </div>
            <div className={styles.row}>
              <dt>Комісія TREBA ({rate}%)</dt>
              <dd>−{formatPrice(commission)} ₴</dd>
            </div>
            <div className={`${styles.row} ${styles.rowAccent}`}>
              <dt>Дохід за рік</dt>
              <dd>{formatPrice(income * 12)} ₴</dd>
            </div>
          </dl>

          <a href="#apply" className={styles.cta}>
            Подати заявку
            <IconArrowRight size={20} className={styles.ctaArrow} />
          </a>

          <p className={styles.note}>
            Розрахунок орієнтовний: не враховує собівартість товару, доставку та податки.
          </p>
        </div>
      </div>
    </SellSection>
  );
}