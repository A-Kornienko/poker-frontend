import { useEffect, useState } from "react";
import { TIMERS } from "../constants/pokerGameConstants";

interface PersistedTimerState {
  totalTime: number;
  expiresAt: number;
}

interface UseTurnTimerBarProps {
  betExpTime?: number;
  timerKey?: string | number;
}

const TIMER_STORAGE_KEY = "poker-turn-timer";

const getTimerStorageKey = (timerKey?: string | number) =>
  typeof timerKey === "undefined" || timerKey === ""
    ? TIMER_STORAGE_KEY
    : `${TIMER_STORAGE_KEY}:${timerKey}`;

const readPersistedTimerState = (
  timerKey?: string | number
): PersistedTimerState | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedValue = window.sessionStorage.getItem(getTimerStorageKey(timerKey));
    if (!storedValue) {
      return null;
    }

    const parsedValue = JSON.parse(storedValue) as Partial<PersistedTimerState>;
    if (
      typeof parsedValue.totalTime === "number" &&
      typeof parsedValue.expiresAt === "number"
    ) {
      return parsedValue as PersistedTimerState;
    }
  } catch {
    return null;
  }

  return null;
};

const persistTimerState = (
  timerKey: string | number | undefined,
  totalTime: number,
  expiresAt: number
) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    getTimerStorageKey(timerKey),
    JSON.stringify({ totalTime, expiresAt })
  );
};

const clearPersistedTimerState = (timerKey?: string | number) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(getTimerStorageKey(timerKey));
};

export const useTurnTimerBar = ({
  betExpTime = 0,
  timerKey,
}: UseTurnTimerBarProps) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const initial = Math.max(0, betExpTime ?? 0);

    if (initial <= 0) {
      setTimeLeft(0);
      setTotalTime(0);
      clearPersistedTimerState(timerKey);
      return;
    }

    const persistedState = readPersistedTimerState(timerKey);
    const now = Date.now();

    if (
      persistedState &&
      persistedState.expiresAt > now &&
      persistedState.totalTime > 0
    ) {
      const remainingTime = Math.max(
        0,
        Math.ceil((persistedState.expiresAt - now) / 1000)
      );
      setTimeLeft(remainingTime);
      setTotalTime(persistedState.totalTime);
    } else {
      setTimeLeft(initial);
      setTotalTime(initial);
      persistTimerState(timerKey, initial, now + initial * 1000);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const nextValue = prev > 0 ? prev - 1 : 0;
        if (nextValue <= 0) {
          clearPersistedTimerState(timerKey);
        }
        return nextValue;
      });
    }, TIMERS.TIMER_INTERVAL);

    return () => clearInterval(timer);
  }, [betExpTime, timerKey]);

  return { timeLeft, totalTime };
};
