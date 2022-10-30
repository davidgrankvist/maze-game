import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";

interface UseIntervalOptions {
  delay: number;
  enabled?: boolean;
}

export function useInterval(callback: () => Promise<void>, { delay, enabled = true }: UseIntervalOptions) {
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

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay, enabled])
}

export function useQueryParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export function useAsyncCall<T>(callback: () => Promise<T>, subscribeTo: any[] = []) {
  const [result, setResult] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const callIt = async () => {
      try {
        setLoading(true);
        const result = await callback();
        setResult(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    callIt();
  }, subscribeTo)
  return { result, error, loading }
}
