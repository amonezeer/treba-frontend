"use client";

import { useId, useState } from "react";
import type { SellFaqItem } from "../../types/sellLanding";
import SellSection from "./SellSection";
import styles from "./SellFaq.module.css";

type SellFaqProps = {
  items: SellFaqItem[];
};

// Аккордеон: открыт только один вопрос, открытие нового закрывает предыдущий
export default function SellFaq({ items }: SellFaqProps) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <SellSection id="faq" eyebrow="Питання та відповіді" title="Часті запитання" fullscreen>
      <div className={styles.list}>
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const buttonId = `${baseId}-q-${index}`;
          const panelId = `${baseId}-a-${index}`;

          return (
            <div key={item.question} className={`${styles.item} ${isOpen ? styles.open : ""}`}>
              <h3 className={styles.questionHeading}>
                <button
                  type="button"
                  id={buttonId}
                  className={styles.question}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  {item.question}
                  <span className={styles.plus} aria-hidden="true" />
                </button>
              </h3>

              {/* grid 0fr -> 1fr даёт плавную анимацию высоты */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={!isOpen}
                className={styles.panel}
              >
                <div className={styles.panelInner}>
                  <p className={styles.answer}>{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.help}>
        <div>
          <p className={styles.helpTitle}>Не знайшли відповіді?</p>
          <p className={styles.helpText}>
            Подайте заявку — менеджер зв&apos;яжеться з вами та розповість усі деталі.
          </p>
        </div>
        <a href="#apply" className={styles.helpLink}>
          Подати заявку
        </a>
      </div>
    </SellSection>
  );
}