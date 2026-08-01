import { useEffect, useRef, useState } from "react";

interface UseTurnTimerProps {
  isTurn: boolean;
  betExpTime?: number;
  playerPlace: string | number;
}

export const useTurnTimer = ({
  isTurn,
  betExpTime,
  playerPlace,
}: UseTurnTimerProps) => {
  const [turnCycle, setTurnCycle] = useState(0);
  const previousBetExpTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isTurn) {
      previousBetExpTimeRef.current = null;
      return;
    }

    const currentBetExpTime = Math.max(0, betExpTime ?? 0);
    const previousBetExpTime = previousBetExpTimeRef.current;

    if (previousBetExpTime === null || currentBetExpTime > previousBetExpTime) {
      previousBetExpTimeRef.current = currentBetExpTime;
      setTurnCycle((prev) => prev + 1);
      return;
    }

    previousBetExpTimeRef.current = currentBetExpTime;
  }, [isTurn, betExpTime]);

  return `${playerPlace}:${turnCycle}`;
};
