import { useMemo } from "react";
import { ASSETS } from "../helpers/assets";

const CHIP_DENOMINATIONS = [
  { value: 1000, image: ASSETS.BET_YELLOW_1000, color: "yellow" },
  { value: 500, image: ASSETS.BET_PURPLE_500, color: "purple" },
  { value: 100, image: ASSETS.BET_BLACK_100, color: "black" },
  { value: 25, image: ASSETS.BET_BLUE_25, color: "blue" },
  { value: 5, image: ASSETS.BET_RED_5, color: "red" },
  { value: 1, image: ASSETS.BET_GREY_1, color: "grey" },
];

export const useChipStack = (bet: number) => {
  return useMemo(() => {
    let remaining = Math.max(0, bet);
    const result = [];

    for (const chip of CHIP_DENOMINATIONS) {
      const count = Math.floor(remaining / chip.value);
      if (count > 0) {
        result.push({ value: chip.value, count, image: chip.image });
        remaining -= count * chip.value;
      }
    }

    return result;
  }, [bet]);
};