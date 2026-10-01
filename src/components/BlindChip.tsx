import React, { memo } from "react";

type ChipType = "dealer" | "smallBlind" | "bigBlind";

interface BlindChipProps {
  type: ChipType;
}

const BlindChip = memo(({ type }: BlindChipProps) => {
  const chipStyles: Record<
    ChipType,
    { bgColor: string; textColor: string; ringColor: string; shadowColor: string; label: string }
  > = {
    dealer: {
      bgColor: "bg-amber-400",
      textColor: "text-amber-950",
      ringColor: "ring-amber-200/70",
      shadowColor: "shadow-amber-950/50",
      label: "D",
    },
    smallBlind: {
      bgColor: "bg-sky-400",
      textColor: "text-sky-950",
      ringColor: "ring-sky-200/70",
      shadowColor: "shadow-sky-950/50",
      label: "SB",
    },
    bigBlind: {
      bgColor: "bg-rose-400",
      textColor: "text-rose-950",
      ringColor: "ring-rose-200/70",
      shadowColor: "shadow-rose-950/50",
      label: "BB",
    },
  };

  const { bgColor, textColor, ringColor, shadowColor, label } = chipStyles[type];

  return (
    <span
      className={`${bgColor} ${textColor} ${ringColor} ${shadowColor} z-10 flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black tracking-tight shadow-lg ring-2 ring-offset-1 ring-offset-zinc-950 transition-transform hover:scale-110`}
    >
      {label}
    </span>
  );
});

export default BlindChip;
