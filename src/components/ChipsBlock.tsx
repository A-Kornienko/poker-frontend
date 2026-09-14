import { memo } from "react";
import { useChipStack } from "../hooks/useChipStack";

interface ChipsBlockProps {
  bet: number;
}
// ChipsBlock displays the player's chip stack
const ChipsBlock = memo(({ bet }: ChipsBlockProps) => {
  const chipStack = useChipStack(bet);

  return (
    <span role="img" aria-label="chips" className="relative cursor-pointer">
      {chipStack.flatMap((chip, chipIndex) =>
        Array.from({ length: chip.count }, (_, countIndex) => (
          <div
            key={`${chip.value}-${countIndex}-${chipIndex}`}
            className="absolute h-6 w-6"
            style={{
              top: chipIndex === 0 ? "-18px" : "-1px",
              right: chipIndex === 0 && countIndex === 0 ? "-4px" : undefined,
              left:
                chipIndex === 1 && countIndex === 0 ? "-12px" : undefined,
            }}
          >
            <img src={chip.image} className="w-full" />
          </div>
        ))
      )}
    </span>
  );
});

export default ChipsBlock;
