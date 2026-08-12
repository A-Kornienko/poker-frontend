import { useSyncExternalStore } from "react";
import { subscribeTableState, getTableStateSnapshot } from "../tableStateStore";
import { createMemoSelector } from "./createMemoSelector";
import type { TableData } from "../../types/poker";

const selectTableState = (state: TableData) => ({
  TableId: state.id,
  name: state.name,
  type: state.type,
  rule: state.rule,
  countPlayers: state.countPlayers,
  limitPlayers: state.limitPlayers,
  smallBlind: state.smallBlind,
  bigBlind: state.bigBlind,
  buyIn: state.buyIn,
  dealerPlace: state.dealerPlace,
  smallBlindPlace: state.smallBlindPlace,
  bigBlindPlace: state.bigBlindPlace,
  round: state.round,
  turnPlace: state.turnPlace,
  myTurn: state.turnPlace === state.myPlace,
  lastWordPlace: state.lastWordPlace,
  betNavigation: state.betNavigation,
  banks: state.banks,
  maxBet: state.maxBet,
  myPrize: state.myPrize,
  betRange: state.betRange,
  myPlace: state.myPlace,
  state: state.state,
});

const memoizedSelectTable = createMemoSelector(selectTableState);

export const useTableState = () =>
  useSyncExternalStore(
    subscribeTableState,
    () => memoizedSelectTable(getTableStateSnapshot()),
    () => memoizedSelectTable(getTableStateSnapshot()),
  );
