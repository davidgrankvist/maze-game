import { useEffect, useMemo } from "react";
import { useLocation } from "react-router";

export function useInterval(callback: () => void, delay: number, enabled = true) {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    callback();
    const id = setInterval(() => callback(), delay);
    return () => clearInterval(id);
  }, [delay, enabled])
}

export function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);

}
