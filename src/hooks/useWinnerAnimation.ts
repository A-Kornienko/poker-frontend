import { useEffect, useRef, useState } from "react";
import { TIMERS } from "../constants/pokerGameConstants";
import { Bank } from "../types/poker";

export const useWinnerAnimation = (bankItems: Bank["items"]) => {
  const [winners, setWinners] = useState<number[]>([]);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!bankItems || Array.isArray(bankItems)) return;

    const key = Object.keys(bankItems)[0];
    const newW = bankItems[key]?.winners || [];
    if (newW.length === 0) return;

    setWinners(newW.map(Number));
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      setWinners([]);
      timeoutRef.current = null;
    }, TIMERS.WINNERS_DISPLAY);
  }, [bankItems]);

  return winners;
};
