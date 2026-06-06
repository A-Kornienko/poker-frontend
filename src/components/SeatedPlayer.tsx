import { Fragment, memo, useMemo } from "react";
import ChipsBlock from "./ChipsBlock";
import Player from "./Player";
import { Card, Player as PlayerType } from "../types/poker";
import { GRID_AREAS, INITIAL_VALUES } from "../constants/pokerGameConstants";

const EMPTY_HOLE_CARDS: Card[] = [];

interface SeatedPlayerProps {
  place: string;
  player: PlayerType;
  myPlace: number;
  turnPlace: number;
  currency: string;
  tableCards: { table: Card[]; player: Card[] };
  isWinner: boolean;
}

const SeatedPlayer = ({
  place,
  player,
  myPlace,
  turnPlace,
  currency,
  tableCards,
  isWinner,
}: SeatedPlayerProps) => {
  const placeNum = Number(place);
  const isTurn = turnPlace === placeNum;
  const isHero = myPlace === placeNum;

  const cards = useMemo(
    () => ({
      table: tableCards.table,
      player: isHero ? tableCards.player : EMPTY_HOLE_CARDS,
    }),
    [tableCards, isHero]
  );
  
  return (
    <Fragment key={placeNum}>
      <div
        className="absolute place-self-center z-30"
        style={{
          gridArea:
            GRID_AREAS.betChip[placeNum] || INITIAL_VALUES.GRID_FALLBACK,
        }}
      >
        {player.bet > 0 && (
          <div className="place-self-center">
            <ChipsBlock />
            <span className="text-white text-sm font-bold text-center ml-3">
              {player.bet} {currency}
            </span>
          </div>
        )}
      </div>
      <div
        className="absolute place-self-center z-20"
        style={{ gridArea: GRID_AREAS.player[placeNum] }}
      >
        <Player
          player={player}
          myPlace={myPlace}
          cards={cards}
          currency={currency}
          isWinner={isWinner}
          isTurn={isTurn}
          betExpTime={isTurn ? player.betExpTime : undefined}
        />
      </div>
    </Fragment>
  );
};

export default memo(SeatedPlayer);
