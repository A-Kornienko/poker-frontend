import type {
  HandHistoryDetails,
  HandHistoryItem,
  HandHistoryListResponse,
  HandHistoryPagination,
  HistoryAction,
  HistoryBlindState,
  HistoryCard,
  HistoryPlayer,
  HistoryPot,
  HistoryWinner,
  HandHistoryResult,
} from '../types/handHistory';

const unwrapData = <T>(payload: T | { data?: T }): T => {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return (payload as { data?: T }).data ?? (payload as T);
  }

  return payload as T;
};

export const mapHandHistoryList = (
  payload: HandHistoryListResponse | Record<string, unknown> | unknown,
): { items: HandHistoryItem[]; pagination: HandHistoryPagination } => {
  const data = unwrapData(payload as HandHistoryListResponse | Record<string, unknown> | unknown) as {
    items?: HandHistoryItem[] | Record<string, unknown>;
    pagination?: HandHistoryPagination;
  };

  const rawItems = Array.isArray(data.items)
    ? data.items
    : data.items && typeof data.items === 'object'
      ? Object.entries(data.items).map(([session, item]) => ({
          session,
          ...(item as Record<string, unknown>),
        }))
      : [];

  return {
    items: rawItems as HandHistoryItem[],
    pagination: (data.pagination ?? {
      total: 0,
      page: 1,
      limit: 20,
      pages: 1,
    }) as HandHistoryPagination,
  };
};

export const mapHandHistoryDetails = (
  payload: HandHistoryDetails | Record<string, unknown> | unknown,
): HandHistoryDetails => {
  const data = unwrapData(payload as HandHistoryDetails | Record<string, unknown> | unknown) as {
    session?: string;
    handNumber?: number;
    gameType?: string;
    status?: string;
    cards?: HistoryCard[];
    boardCards?: HistoryCard[];
    players?: HistoryPlayer[] | Record<string, unknown>;
    blinds?: HistoryBlindState;
    dealer?: number;
    preflop?: HistoryAction[];
    flop?: HistoryAction[];
    turn?: HistoryAction[];
    river?: HistoryAction[];
    pot?: HistoryPot;
    winners?: HistoryWinner[];
    results?: HandHistoryResult[];
    isAuthorized?: boolean;
  };

  const players = Array.isArray(data.players)
    ? data.players
    : data.players && typeof data.players === 'object'
      ? (Object.values(data.players) as HistoryPlayer[])
      : [];

  const boardCards = Array.isArray(data.boardCards)
    ? data.boardCards
    : Array.isArray(data.cards)
      ? data.cards
      : [];

  return {
    session: String(data.session ?? ''),
    handNumber: data.handNumber,
    gameType: data.gameType,
    status: data.status,
    cards: Array.isArray(data.cards) ? data.cards : boardCards,
    boardCards,
    players,
    blinds: (data.blinds ?? {
      smallBlind: 0,
      bigBlind: 0,
    }) as HistoryBlindState,
    dealer: data.dealer,
    preflop: Array.isArray(data.preflop) ? data.preflop : [],
    flop: Array.isArray(data.flop) ? data.flop : [],
    turn: Array.isArray(data.turn) ? data.turn : [],
    river: Array.isArray(data.river) ? data.river : [],
    pot: (data.pot ?? {
      preFlop: 0,
      flop: 0,
      turn: 0,
      river: 0,
    }) as HistoryPot,
    winners: Array.isArray(data.winners) ? data.winners : [],
    results: Array.isArray(data.results) ? data.results : [],
    isAuthorized: Boolean(data.isAuthorized),
  };
};

export const normalizeHandHistoryList = mapHandHistoryList;
export const normalizeHandHistoryDetails = mapHandHistoryDetails;
