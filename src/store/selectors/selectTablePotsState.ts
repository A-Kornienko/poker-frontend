import { useSyncExternalStore } from "react";
import { subscribeTableState, getTableStateSnapshot } from "../tableStateStore";
import { createMemoSelector } from "./createMemoSelector";
import type { TableData } from "../../types/poker";

const selectTablePotsState = (state: TableData) => ({
  banks: state.banks,
  currency: state.currency,
});

const memoizedSelectTablePots = createMemoSelector(selectTablePotsState);

export const useTablePotsState = () =>
  useSyncExternalStore(
    subscribeTableState,
    () => memoizedSelectTablePots(getTableStateSnapshot()),
    () => memoizedSelectTablePots(getTableStateSnapshot()),
  );
