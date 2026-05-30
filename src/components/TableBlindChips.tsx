import { memo } from "react";
import BlindChip from "./BlindChip";
import { GRID_AREAS } from "../constants/pokerGameConstants";

interface TableBlindChipsProps {
  dealerPlace: number;
  smallBlindPlace: number;
  bigBlindPlace: number;
}

const TableBlindChips = ({
  dealerPlace,
  smallBlindPlace,
  bigBlindPlace,
}: TableBlindChipsProps) => {
  const chips = [
    { place: dealerPlace, type: "dealer" },
    { place: smallBlindPlace, type: "smallBlind" },
    { place: bigBlindPlace, type: "bigBlind" },
  ];

  return (
    <>
      {chips.map(
        ({ place, type }) =>
          place > 0 && (
            <div
              key={`${type}-${place}`}
              className="place-self-center z-30"
              style={{
                gridArea: GRID_AREAS.blindChip[place],
              }}
            >
              <BlindChip type={type} />
            </div>
          )
      )}
    </>
  );
}

export default memo(TableBlindChips);