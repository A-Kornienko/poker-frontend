import { useEffect, useRef, useState } from "react";
import { Bank } from "../types/poker";
import { TIMERS } from "../constants/pokerGameConstants";
import { banksChanged } from "../utils/banks";

export const useBankAnimation = (banks: Bank) => {
  const [animatedBanks, setAnimatedBanks] = useState<Record<string, boolean>>(
    {}
  );
  const [isRakeAnimated, setIsRakeAnimated] = useState(false);
  const prevBanksRef = useRef(banks);

  useEffect(() => {
    if (!banksChanged(prevBanksRef.current, banks)) {
      return;
    }

    const newAnimatedBanks = Object.keys(banks.items).reduce(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );
    setAnimatedBanks(newAnimatedBanks);
    setIsRakeAnimated(true);

    prevBanksRef.current = banks;
    const timeout = setTimeout(() => {
      setAnimatedBanks({});
      setIsRakeAnimated(false);
    }, TIMERS.ANIMATION_DURATION);

    return () => clearTimeout(timeout);
  }, [banks]);

  return { animatedBanks, isRakeAnimated };
};
