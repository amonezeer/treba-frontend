// Адрес возврата после входа/регистрации (?next=...).
// Пропускаем только внутренние пути, чтобы ссылкой нельзя было увести на чужой сайт.

export function getSafeNextPath(value: string | null | undefined, fallback = "/"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

/** Ссылка на вход/регистрацию с возвратом на next */
export function buildAuthHref(path: "/login" | "/register", next?: string): string {
  return next ? `${path}?next=${encodeURIComponent(next)}` : path;
}