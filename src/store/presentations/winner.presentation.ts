import type { Bank, Player, TableData } from "../../types/poker";
import type { TablePresentation } from "./types";

export type WinnerPresentationData = {
  players: { [place: string]: Player };
  banks: Bank;
};

export const winnerPresentation: TablePresentation<WinnerPresentationData> = {
  name: "winner",

  active: false,

  data: null,

  activate: (tableData: TableData) => {
    winnerPresentation.data = {
      players: tableData.players,
      banks: tableData.banks,
    };

    winnerPresentation.active = true;
  },

  deactivate: () => {
    winnerPresentation.active = false;
    winnerPresentation.data = null;
  },
};