import { useSyncExternalStore } from "react";

import { subscribeTableState, getTableStateSnapshot } from "../tableStateStore";

import {
  subscribeTableUIState,
  getTableUIStateSnapshot,
} from "../tableStateStoreUI";

import { createMemoSelector } from "./createMemoSelector";

const selectSeatedPlayersState = ({
  tableState,
  uiState,
}: {
  tableState: ReturnType<typeof getTableStateSnapshot>;
  uiState: ReturnType<typeof getTableUIStateSnapshot>;
}) => {
  const winnerPresentation = uiState.presentations.winner;

  const players = winnerPresentation.active
    ? (winnerPresentation.data?.players ?? {})
    : tableState.players;

  const winners = winnerPresentation.active
    ? winnerPresentation.data?.banks.items || {}
    : tableState.banks.items || {};

  return {
    players,
    myPlace: tableState.myPlace,
    turnPlace: tableState.turnPlace,
    currency: tableState.currency,
    cards: tableState.cards,
    round: tableState.round,
    state: tableState.state,
    winners,
    winnerActive: winnerPresentation.active,
  };
};

const memoizedSelectSeatedPlayers = createMemoSelector(
  selectSeatedPlayersState,
);

let lastTableState = getTableStateSnapshot();
let lastUIState = getTableUIStateSnapshot();

let lastSnapshot = {
  tableState: lastTableState,
  uiState: lastUIState,
};

const getSnapshot = () => {
  const tableState = getTableStateSnapshot();
  const uiState = getTableUIStateSnapshot();

  if (tableState !== lastTableState || uiState !== lastUIState) {
    lastTableState = tableState;
    lastUIState = uiState;

    lastSnapshot = {
      tableState,
      uiState,
    };
  }

  return lastSnapshot;
};

const subscribe = (listener: () => void) => {
  const unsubscribeTable = subscribeTableState(listener);
  const unsubscribeUI = subscribeTableUIState(listener);

  return () => {
    unsubscribeTable();
    unsubscribeUI();
  };
};

export const useSeatedPlayersState = () =>
  useSyncExternalStore(
    subscribe,
    () => memoizedSelectSeatedPlayers(getSnapshot()),
    () => memoizedSelectSeatedPlayers(getSnapshot()),
  );
