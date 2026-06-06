import { memo } from "react";
import BlindChip from "./BlindChip";
import { GRID_AREAS } from "../constants/pokerGameConstants";
import { useTableBlindChipsState } from "../store/selectors/selectTableBlindChipsState";

const TableBlindChips = () => {
  const { dealerPlace, smallBlindPlace, bigBlindPlace } =
    useTableBlindChipsState();

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
          ),
      )}
    </>
  );
};

export default memo(TableBlindChips);
