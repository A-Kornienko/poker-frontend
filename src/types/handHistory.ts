import { Card } from "./poker";

export interface HistoryCard extends Card {
  name: string;
  view: string;
  type: "hand" | "table";
}

export interface HandHistoryItem {
  session: string;
  startedAt: string | number;
  endedAt: string | number;
  cards?: HistoryCard[];
  winners: string[];
  bank: number;
}

export interface HandHistoryPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface HandHistoryListResponse {
  success: boolean;
  data: {
    items: Record<string, Omit<HandHistoryItem, "session">>;
    pagination: HandHistoryPagination;
    isAuthorized: boolean;
  };
}

export interface HistoryPlayer {
  place: number;
  login: string;
  cards: HistoryCard[];
  stack: number;
  position: string;
  isMyPlayer: boolean;
}

export interface HistoryBlindState {
  smallBlindPlace: number;
  bigBlindPlace: number;
  smallBlind: number;
  bigBlind: number;
}

export interface HistoryAction {
  place: number;
  type: string;
  betType: string;
  amount: number | null;
}

export interface HistoryPot {
  preFlop: number;
  flop: number;
  turn: number;
  river: number;
}

export interface WinningCombination {
  name: string;
  rank: number;
  cards: HistoryCard[];
}

export interface HistoryWinner {
  login: string;
  combination?: WinningCombination;
  handCards: HistoryCard[];
  sum: number;
}

export interface HandHistoryDetails {
  session: string;
  cards: HistoryCard[];
  players: Record<string, HistoryPlayer>;
  blinds: HistoryBlindState;
  dealer: number;
  preflop: HistoryAction[];
  flop: HistoryAction[];
  turn: HistoryAction[];
  river: HistoryAction[];
  pot: HistoryPot;
  winners: HistoryWinner[];
  isAuthorized: boolean;
}

export interface HandHistoryDetailsResponse {
  success: boolean;
  data: HandHistoryDetails;
}
