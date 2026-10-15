import type { StatusTone } from "../../lib/sellerStatus";
import styles from "./StatusBadge.module.css";

type StatusBadgeProps = {
  label: string;
  tone: StatusTone;
};

// Кольорова плашка статусу товару або замовлення
export default function StatusBadge({ label, tone }: StatusBadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{label}</span>;
}