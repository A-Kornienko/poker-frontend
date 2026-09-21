import type { TableData } from "../types/poker";
import { presentationRules } from "./presentationRules";
import { presentationRegistry } from "./presentationRegistry";

const DEBUG = false;

type TableUIState = {
  presentations: {
    winner: {
      active: boolean;
      data: typeof presentationRegistry.winner.data;
    };
  };
};

let currentTableState: TableData = {
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

let currentUIState: TableUIState = {
  presentations: {
    winner: {
      active: false,
      data: null,
    },
  },
};

const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export const subscribeTableUIState = (listener: () => void) => {
  listeners.add(listener);

  return () => listeners.delete(listener);
};

export const getTableUIStateSnapshot = (): TableUIState => {
  return currentUIState;
};

const updatePresentationSnapshot = () => {
  currentUIState = {
    presentations: {
      winner: {
        active: presentationRegistry.winner.active,
        data: presentationRegistry.winner.data,
      },
    },
  };
};

export const setTableStateUI = (nextState: TableData) => {
  const previousState = currentTableState;
  currentTableState = nextState;

  if (DEBUG) {
    console.log("[tableStateStoreUI]", {
      previousState,
      nextState,
    });
  }

  for (const config of presentationRules) {
    if (config.rule.check(previousState, nextState)) {
      config.presentations.forEach((presentation) => {
        presentation.activate(nextState);
      });
    }
  }

  updatePresentationSnapshot();
  notifyListeners();
};

export const deactivatePresentation = (
  presentation: {
    deactivate: () => void;
  },
) => {
  presentation.deactivate();

  updatePresentationSnapshot();

  notifyListeners();
};