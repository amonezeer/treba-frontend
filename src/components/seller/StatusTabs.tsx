import styles from "./StatusTabs.module.css";

export type StatusTabOption<T extends string> = {
  value: T;
  label: string;
};

type StatusTabsProps<T extends string> = {
  tabs: StatusTabOption<T>[];
  value: T;
  counts: Record<T, number>;
  ariaLabel: string;
  onChange: (value: T) => void;
};

// Вкладки-«пігулки» зі статусами та лічильниками (товари, замовлення)
export default function StatusTabs<T extends string>({
  tabs,
  value,
  counts,
  ariaLabel,
  onChange,
}: StatusTabsProps<T>) {
  return (
    <div className={styles.tabs} role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
            <span className={styles.tabCount}>{counts[tab.value]}</span>
          </button>
        );
      })}
    </div>
  );
}