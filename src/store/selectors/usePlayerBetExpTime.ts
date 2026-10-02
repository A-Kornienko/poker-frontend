import { useSyncExternalStore } from "react";
import {
  getTableStateSnapshot,
  subscribeTableState,
} from "../tableStateStore";

export const usePlayerBetExpTime = (place: string | number) =>
  useSyncExternalStore(
    subscribeTableState,
    () => getTableStateSnapshot().players[String(place)]?.betExpTime ?? 0,
    () => getTableStateSnapshot().players[String(place)]?.betExpTime ?? 0,
  );