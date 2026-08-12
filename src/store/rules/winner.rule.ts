import type { TableStateRule } from "./types";

export const winnerRule: TableStateRule = {
  name: "winner",

  check: (previousState, currentState) => {
    return (
      previousState.state !== "init" &&
      currentState.state === "init"
    );
  },
};