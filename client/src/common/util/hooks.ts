import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router";

export function useInterval(callback: () => Promise<void>, delay: number, enabled = true) {
  const savedCallback = useRef<typeof callback>();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback])

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const tick = () => {
      savedCallback.current?.();
    }
    tick();

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay, enabled])
}

export function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);

}
