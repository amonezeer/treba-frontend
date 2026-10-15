import styles from "./SearchField.module.css";

type SearchFieldProps = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

// Поле пошуку з іконкою-лупою
export default function SearchField({ value, placeholder, onChange }: SearchFieldProps) {
  return (
    <div className={styles.wrap}>
      <svg
        className={styles.icon}
        viewBox="0 0 20 20"
        width="18"
        height="18"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="9" cy="9" r="6" stroke="#8a8578" strokeWidth="1.6" />
        <path d="M17 17l-4-4" stroke="#8a8578" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        className={styles.input}
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}