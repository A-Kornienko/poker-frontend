import { memo } from "react";
import SeatedPlayer from "./SeatedPlayer";
import { useSeatedPlayersState } from "../store/selectors/selectSeatedPlayersState";
import { useWinnerAnimation } from "../hooks/useWinnerAnimation";
import { presentationRegistry } from "../store/presentationRegistry";
import { deactivatePresentation } from "../store/tableStateStoreUI";

const SeatedPlayers = () => {
  const {
    players,
    myPlace,
    turnPlace,
    currency,
    cards,
    state,
    winners,
    winnerActive,
  } = useSeatedPlayersState();

  useWinnerAnimation({
    isActive: winnerActive,
    onComplete: () => {
      deactivatePresentation(presentationRegistry.winner);
    },
  });

  const winnerPlaces = Object.values(winners).flatMap(
    (item) => item.winners ?? [],
  );

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
          tableState={state}
          isWinner={winnerPlaces.includes(Number(place))}
        />
      ))}
    </>
  );
};

export default memo(SeatedPlayers);
