export interface Card {
  suit: string;
  value: string;
}

export interface Player {
  place: string;
  betExpTime?: number;
  profile: { name: string };
  stack: number;
  bet: number;
  betType?: string;
  lastAction?: string;
}

export interface Bank {
  rake: number;
  items: { [key: string]: { sum: number; winners?: number[] } };
}

export interface TableData {
  id: number;
  name: string;
  type: string;
  rule: string;
  style: string;
  turnPlace: number;
  lastWordPlace: number;
  dealerPlace: number;
  smallBlindPlace: number;
  bigBlindPlace: number;
  round: string;
  smallBlind: number;
  bigBlind: number;
  currency: string;
  limitPlayers: number;
  countPlayers: number;
  image: string;
  roundExpirationTime: number;
  buyIn: number;
  players: { [place: string]: Player };
  banks: Bank;
  cards: { table: Card[]; player: Card[] };
  countCards: number;
  betNavigation: string[];
  betRange: { min: number; max: number };
  myPlace: number;
  myPrize: { rank: number; sum: number };
  spectators: number;
  maxBet: number;
  session: any;
  tournament: any[];
  playerSetting: any[];
  state: string;
  suggestCombination: string;
  isAuthorized: boolean;
}
