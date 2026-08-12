import type { TableData } from "../../types/poker";

export type TableStateRule = {
  name: string;

  check: (
    previousState: TableData,
    currentState: TableData
  ) => boolean;
};