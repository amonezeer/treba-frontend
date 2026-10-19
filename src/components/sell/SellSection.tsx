import type { ReactNode } from "react";
import styles from "./SellSection.module.css";

type SellSectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  /** Подпись для секции без видимого заголовка */
  ariaLabel?: string;
  /** Секция минимум на высоту экрана, контент по центру */
  fullscreen?: boolean;
  /** Класс для внешнего блока (например, фон на всю ширину) */
  className?: string;
  children: ReactNode;
};

// Общая обёртка секций лендинга: фон на всю ширину + контейнер с отступами 40px
export default function SellSection({
  id,
  eyebrow,
  title,
  subtitle,
  ariaLabel,
  fullscreen = false,
  className,
  children,
}: SellSectionProps) {
  const titleId = id && title ? `${id}-title` : undefined;

  return (
    <section
      id={id}
      className={`${styles.section} ${fullscreen ? styles.fullscreen : ""} ${className ?? ""}`}
      aria-labelledby={titleId}
      aria-label={titleId ? undefined : ariaLabel}
    >
      <div className={styles.inner}>
        {title && (
          <div className={styles.heading}>
            {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}