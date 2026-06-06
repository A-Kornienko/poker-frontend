import { useSyncExternalStore } from "react";
import { subscribeTableState, getTableStateSnapshot } from "../tableStateStore";
import { createMemoSelector } from "./createMemoSelector";
import type { TableData } from "../../types/poker";

export const selectSeatedPlayersState = (state: TableData) => ({
  players: state.players,
  myPlace: state.myPlace,
  turnPlace: state.turnPlace,
  currency: state.currency,
  cards: state.cards,
  winners: state.banks.items || [],
});

const memoizedSelectSeatedPlayers = createMemoSelector(
  selectSeatedPlayersState,
);

export const useSeatedPlayersState = () =>
  useSyncExternalStore(
    subscribeTableState,
    () => memoizedSelectSeatedPlayers(getTableStateSnapshot()),
    () => memoizedSelectSeatedPlayers(getTableStateSnapshot()),
  );
