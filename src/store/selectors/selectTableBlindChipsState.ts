import { useSyncExternalStore } from "react";
import { subscribeTableState, getTableStateSnapshot } from "../tableStateStore";
import { createMemoSelector } from "./createMemoSelector";
import type { TableData } from "../../types/poker";

const selectTableBlindChipsState = (state: TableData) => ({
  dealerPlace: state.dealerPlace,
  smallBlindPlace: state.smallBlindPlace,
  bigBlindPlace: state.bigBlindPlace,
});

const memoizedSelectTableBlindChips = createMemoSelector(
  selectTableBlindChipsState,
);

export const useTableBlindChipsState = () =>
  useSyncExternalStore(
    subscribeTableState,
    () => memoizedSelectTableBlindChips(getTableStateSnapshot()),
    () => memoizedSelectTableBlindChips(getTableStateSnapshot()),
  );
