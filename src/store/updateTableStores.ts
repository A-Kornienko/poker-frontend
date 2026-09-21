import type { TableData } from "../types/poker";
import { deepEqual } from "../utils/deepEqual";
import {
  getTableStateSnapshot,
  setTableState,
} from "./tableStateStore";

import { setTableStateUI } from "./tableStateStoreUI";

export const updateTableStores = (newData: TableData): boolean => {
  const currentState = getTableStateSnapshot();

  const nextState: TableData = {
    ...currentState,
    ...newData,
  };

  if (deepEqual(currentState, nextState)) {
    return false;
  }

  setTableState(nextState);
  setTableStateUI(nextState);

  return true;
};