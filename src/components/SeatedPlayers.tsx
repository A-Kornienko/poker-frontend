import { memo } from "react";
import SeatedPlayer from "./SeatedPlayer";
import { Card, Player as PlayerType } from "../types/poker";

interface SeatedPlayersProps {
  players: Record<string, PlayerType>;
  myPlace: number;
  turnPlace: number;
  currency: string;
  tableCards: Card[];
  holeCards: Card[];
  winners: number[];
}

const SeatedPlayers = ({
  players,
  myPlace,
  turnPlace,
  currency,
  tableCards,
  holeCards,
  winners,
}: SeatedPlayersProps) => (
  <>
    {Object.keys(players).map((place) => (
      <SeatedPlayer
        key={place}
        place={place}
        player={players[place]}
        myPlace={myPlace}
        turnPlace={turnPlace}
        currency={currency}
        tableCards={tableCards}
        holeCards={holeCards}
        isWinner={winners.includes(Number(place))}
      />
    ))}
  </>
);

export default memo(SeatedPlayers);
