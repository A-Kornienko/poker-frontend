import { useSyncExternalStore } from "react";
import { subscribeTableState, getTableStateSnapshot } from "../tableStateStore";
import { createMemoSelector } from "./createMemoSelector";
import type { TableData } from "../../types/poker";

const selectTableState = (state: TableData) => ({
  TableId: state.id,
  banks: state.banks,
  betRange: state.betRange,
  myPlace: state.myPlace,
  myTurn: state.turnPlace === state.myPlace,
  betNavigation: state.betNavigation,
});

const memoizedSelectTable = createMemoSelector(selectTableState);

export const useTableState = () =>
  useSyncExternalStore(
    subscribeTableState,
    () => memoizedSelectTable(getTableStateSnapshot()),
    () => memoizedSelectTable(getTableStateSnapshot()),
  );
