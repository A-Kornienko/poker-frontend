import CardBack from "../assets/images/card-back.png";
import BetBlack100 from "../assets/images/icons/bet_black_100.svg";
import BetRed5 from "../assets/images/icons/bet_red_5.svg";
import BetYellow50 from "../assets/images/icons/bet_yellow_50.svg";
import RebuyChip from "../assets/images/icons/rebuy-chip.png";
import PokerTable from "../assets/images/poker-table.png";
import LeaveTable from "../assets/images/icons/leave-table.svg";
import Chat from "../assets/images/icons/chat.svg";
import Settings from "../assets/images/icons/settings.svg";

interface Assets {
  CARD_BACK: string;
  BET_BLACK_100: string;
  BET_RED_5: string;
  BET_YELLOW_50: string;
  REBUY_CHIP: string;
  POKER_TABLE: string;
  LEAVE_TABLE: string;
  CHAT: string;
  SETTINGS: string;
  CARDS: (suit: string, value: string) => string;
}

export const ASSETS: Assets = {
  CARD_BACK: CardBack,
  BET_BLACK_100: BetBlack100,
  BET_RED_5: BetRed5,
  BET_YELLOW_50: BetYellow50,
  REBUY_CHIP: RebuyChip,
  POKER_TABLE: PokerTable,
  LEAVE_TABLE: LeaveTable,
  CHAT: Chat,
  SETTINGS: Settings,
  CARDS: (suit: string, value: string) => `/src/assets/images/cards/${suit}/${value}.webp`,
};