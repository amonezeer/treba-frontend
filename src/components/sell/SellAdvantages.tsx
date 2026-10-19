import type { SellAdvantage } from "../../types/sellLanding";
import SellSection from "./SellSection";
import { SellIcon } from "./SellIcons";
import styles from "./SellAdvantages.module.css";

type SellAdvantagesProps = {
  advantages: SellAdvantage[];
};

export default function SellAdvantages({ advantages }: SellAdvantagesProps) {
  return (
    <SellSection
      id="advantages"
      eyebrow="Чому TREBA"
      title="Усе, щоб продавати більше"
      subtitle="Ми беремо на себе вітрину, покупців і технічну частину — ви займаєтесь товаром і сервісом."
      fullscreen
    >
      <ul className={styles.grid}>
        {advantages.map((item, index) => (
          <li key={item.title} className={styles.card}>
            <span className={styles.number} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className={styles.icon}>
              <SellIcon name={item.icon} size={30} />
            </span>

            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.text}>{item.text}</p>
          </li>
        ))}
      </ul>
    </SellSection>
  );
}