import { useSyncExternalStore } from "react";
import { subscribeTableState, getTableStateSnapshot } from "../tableStateStore";
import { createMemoSelector } from "./createMemoSelector";
import type { TableData } from "../../types/poker";

const selectTableCardsState = (state: TableData) => state.cards.table;
const memoizedSelectTableCards = createMemoSelector(selectTableCardsState);

export const useTableCards = () =>
  useSyncExternalStore(
    subscribeTableState,
    () => memoizedSelectTableCards(getTableStateSnapshot()),
    () => memoizedSelectTableCards(getTableStateSnapshot()),
  );
