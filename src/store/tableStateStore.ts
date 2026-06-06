import type { TableData } from "../types/poker";

const DEBUG = true;

let currentState: TableData = {
  id: 0,
  name: "",
  type: "",
  rule: "",
  style: "",
  turnPlace: 0,
  lastWordPlace: 0,
  dealerPlace: 0,
  smallBlindPlace: 0,
  bigBlindPlace: 0,
  round: "",
  smallBlind: 0,
  bigBlind: 0,
  currency: "",
  limitPlayers: 0,
  countPlayers: 0,
  image: "",
  roundExpirationTime: 0,
  buyIn: 0,
  players: {},
  banks: { rake: 0, items: {} },
  cards: { table: [], player: [] },
  countCards: 0,
  betNavigation: [],
  betRange: { min: 0, max: 0 },
  myPlace: 0,
  myPrize: { rank: 0, sum: 0 },
  spectators: 0,
  maxBet: 0,
  session: null,
  tournament: [],
  playerSetting: [],
  state: "init",
  suggestCombination: "",
  isAuthorized: false,
};

const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export const subscribeTableState = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getTableStateSnapshot = (): TableData => currentState;

export const initTableState = (tableData: TableData) => {
  currentState = tableData;
  if (DEBUG) console.log("[tableStateStore] initialized", currentState);
  notifyListeners();
};

export const updateTableState = (newData: Partial<TableData>) => {
  currentState = { ...currentState, ...newData };
  if (DEBUG) console.log("[tableStateStore] updated", currentState);
  notifyListeners();
};
