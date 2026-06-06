import { useCallback, useMemo, useState } from "react";

import BetService from "../api/BetService";
import { useFetching } from "./useFetching";

type BetRange = {
  min: number;
  max: number;
};

export const useBetting = (tableId: number, betRange?: BetRange) => {
  const [betAmount, setBetAmount] = useState(0);

  const minBet = useMemo(() => betRange?.min ?? 0, [betRange]);

  const maxBet = useMemo(() => betRange?.max ?? 0, [betRange]);

  const [fetchAction, isLoading, error] = useFetching(
    async (tableId: number, action: string, amount: number) => {
      await BetService.bet(tableId, action, amount);
    },
  );

  const onAction = useCallback(
    (action: string) => {
      fetchAction(tableId, action, betAmount);
    },
    [tableId, betAmount, fetchAction],
  );

  const onChangeBet = useCallback(
    (value: number | string) => {
      let nextValue = Number(value);

      if (nextValue < minBet) {
        nextValue = minBet;
      }

      if (nextValue > maxBet) {
        nextValue = maxBet;
      }

      setBetAmount(nextValue);
    },
    [minBet, maxBet],
  );

  const onPercentBet = useCallback(
    (percent: number) => {
      const value = Math.floor((maxBet * percent) / 100);

      setBetAmount(value);
    },
    [maxBet],
  );

  return {
    betAmount,
    minBet,
    maxBet,
    onAction,
    onChangeBet,
    onPercentBet,
    isLoading,
    error,
  };
}
