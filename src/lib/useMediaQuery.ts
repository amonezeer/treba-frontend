import { useCallback, useSyncExternalStore } from "react";

// Подписка на media query без setState в эффекте.
// serverValue — значение при серверном рендере (до гидрации).
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue
  );
}