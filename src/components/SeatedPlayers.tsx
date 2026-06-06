import { memo } from "react";
import SeatedPlayer from "./SeatedPlayer";
import { useSeatedPlayersState } from "../store/selectors/selectSeatedPlayersState";
import { useWinnerAnimation } from "../hooks/useWinnerAnimation";

const SeatedPlayers = () => {
  const { players, myPlace, turnPlace, currency, cards, winners } =
    useSeatedPlayersState();

  const winnersPlayers = useWinnerAnimation(winners);

  return (
    <>
      {Object.keys(players).map((place) => (
        <SeatedPlayer
          key={place}
          place={place}
          player={players[place]}
          myPlace={myPlace}
          turnPlace={turnPlace}
          currency={currency}
          tableCards={cards}
          isWinner={winnersPlayers.includes(Number(place))}
        />
      ))}
    </>
  );
};

export default memo(SeatedPlayers);
