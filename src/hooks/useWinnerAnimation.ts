import { useEffect, useState } from "react";
import { TIMERS } from "../constants/pokerGameConstants";
import { Bank } from "../types/poker";

export const useWinnerAnimation = (bankItems: Bank["items"]) => {
  const [winners, setWinners] = useState<number[]>([]);

  useEffect(() => {
    if (!bankItems || Object.keys(bankItems).length === 0) return;

    const key = Object.keys(bankItems)[0];
    if (bankItems[key].winners.length === 0) return;

    setWinners(bankItems[key].winners.map(Number));
    const timeout = setTimeout(() => setWinners([]), TIMERS.WINNERS_DISPLAY);

    return () => clearTimeout(timeout);
  }, [bankItems]);

  return winners;
};
