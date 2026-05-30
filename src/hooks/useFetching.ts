import { useState, useCallback, useRef } from "react";

type FetchCallback = (...args: any[]) => Promise<void>;

export const useFetching = (callback: FetchCallback) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const fetching = useCallback(async (...args: Parameters<FetchCallback>) => {
    try {
      setError(null);
      setIsLoading(true);
      await callbackRef.current(...args);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  return [fetching, isLoading, error] as const;
};
