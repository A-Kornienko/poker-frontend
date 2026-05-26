import React, { memo } from "react";

type ChipType = "dealer" | "smallBlind" | "bigBlind";

interface BlindChipProps {
  type: ChipType;
}

const BlindChip = memo(({ type }: BlindChipProps) => {
  const chipStyles: Record<
    ChipType,
    { bgColor: string; textColor: string; label: string }
  > = {
    dealer: {
      bgColor: "bg-yellow-400",
      textColor: "text-black",
      label: "D",
    },
    smallBlind: {
      bgColor: "bg-blue-600",
      textColor: "text-white",
      label: "SB",
    },
    bigBlind: {
      bgColor: "bg-red-600",
      textColor: "text-white",
      label: "BB",
    },
  };

  const { bgColor, textColor, label } = chipStyles[type];

  return (
    <span
      className={`${bgColor} ${textColor} rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow z-10`}
    >
      {label}
    </span>
  );
});

export default BlindChip;
