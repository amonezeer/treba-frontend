"use client";

import { useState } from "react";
import styles from "./SellerStockInput.module.css";

type SellerStockInputProps = {
  value: number;
  isSaving: boolean;
  onSave: (stock: number) => void;
};

// Поле залишку: зберігається по Enter або при втраті фокусу, Escape — скасувати
export default function SellerStockInput({ value, isSaving, onSave }: SellerStockInputProps) {
  const [draft, setDraft] = useState(String(value));

  function commit() {
    const parsed = Number(draft);
    if (draft.trim() === "" || !Number.isFinite(parsed) || parsed < 0) {
      setDraft(String(value));
      return;
    }
    const next = Math.floor(parsed);
    if (next !== value) onSave(next);
  }

  function change(delta: number) {
    const next = Math.max(0, value + delta);
    setDraft(String(next));
    if (next !== value) onSave(next);
  }

  return (
    <div className={`${styles.wrapper} ${isSaving ? styles.saving : ""}`}>
      <button
        type="button"
        className={styles.stepButton}
        aria-label="Зменшити залишок"
        disabled={isSaving || value === 0}
        onClick={() => change(-1)}
      >
        −
      </button>
      <input
        type="text"
        inputMode="numeric"
        className={styles.input}
        aria-label="Залишок на складі"
        value={draft}
        disabled={isSaving}
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, ""))}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          if (e.key === "Escape") {
            setDraft(String(value));
            e.currentTarget.blur();
          }
        }}
      />
      <button
        type="button"
        className={styles.stepButton}
        aria-label="Збільшити залишок"
        disabled={isSaving}
        onClick={() => change(1)}
      >
        +
      </button>
    </div>
  );
}