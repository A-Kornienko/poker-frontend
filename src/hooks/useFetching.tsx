import { useState } from "react";

type FetchCallback = (...args: any[]) => Promise<void>;

export const useFetching = (callback: FetchCallback) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetching = async (...args: any[]) => {
    try {
      setError(null);
      setIsLoading(true);
      await callback(...args);
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return [fetching, isLoading, error] as const;
};
