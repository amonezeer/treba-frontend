// Типы контента лендинга для продавцов (/sell)

export type SellIconName = "users" | "wallet" | "truck" | "chart" | "megaphone" | "headset";

export type SellStat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  description: string;
};

export type SellAdvantage = {
  icon: SellIconName;
  title: string;
  text: string;
};

export type SellCommissionCategory = {
  id: string;
  label: string;
  /** Комиссия в процентах */
  rate: number;
};

export type SellStep = {
  title: string;
  /** Сколько занимает шаг: «5 хвилин», «1–3 дні» */
  duration: string;
  text: string;
  points: string[];
};

export type SellFaqItem = {
  question: string;
  answer: string;
};