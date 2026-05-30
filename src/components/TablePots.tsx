import { memo } from "react";

interface TablePotsProps {
  banks: { rake: 0, items: {} };
  currency: string;
  animatedBanks: {};
  isRakeAnimated: boolean;
}

const TablePots =({
  banks,
  currency,
  animatedBanks,
  isRakeAnimated,
}: TablePotsProps) => {
  if (!Object.keys(banks.items).length) {
    return null;
  }

  return (
    <div className="absolute place-self-center top-[32%] text-center z-10">
      {Object.entries(banks.items).map(([key, bank], index) => (
        <div
          key={key}
          className={`text-white text-lg font-semibold drop-shadow ${
            animatedBanks[key] ? "my-animate-pulse" : ""
          }`}
        >
          {index === 0 ? "Pot" : `Side Pot ${index}`}:
          {bank.sum} {currency}
        </div>
      ))}

      <div
        className={`text-white text-base font-semibold drop-shadow ${
          isRakeAnimated ? "my-animate-pulse" : ""
        }`}
      >
        Rake: {banks.rake} {currency}
      </div>
    </div>
  );
}

export default memo(TablePots);