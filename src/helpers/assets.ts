import CardBack from "../assets/images/card-back.png";
import BetGrey1 from "../assets/images/icons/bet_grey_1.svg";
import BetRed5 from "../assets/images/icons/bet_red_5.svg";
import BetBlue25 from "../assets/images/icons/bet_blue_25.svg";
import BetBlack100 from "../assets/images/icons/bet_black_100.svg";
import BetPurple500 from "../assets/images/icons/bet_purple_500.svg";
import BetYellow1000 from "../assets/images/icons/bet_yellow_1000.svg";
import RebuyChip from "../assets/images/icons/rebuy-chip.png";
import PokerTable from "../assets/images/poker-table.jpg";
import LeaveTable from "../assets/images/icons/leave-table.svg";
import Chat from "../assets/images/icons/chat.svg";
import HistoryTable from "../assets/images/icons/history-table.svg";

interface Assets {
  CARD_BACK: string;
  BET_GREY_1: string;
  BET_RED_5: string;
  BET_BLUE_25: string;
  BET_BLACK_100: string;
  BET_PURPLE_500: string;
  BET_YELLOW_1000: string;
  REBUY_CHIP: string;
  POKER_TABLE: string;
  LEAVE_TABLE: string;
  CHAT: string;
  HISTORY_TABLE: string;
  CARDS: (suit: string, value: string) => string;
}

export const ASSETS: Assets = {
  CARD_BACK: CardBack,
  BET_GREY_1: BetGrey1,
  BET_RED_5: BetRed5,
  BET_BLUE_25: BetBlue25,
  BET_BLACK_100: BetBlack100,
  BET_PURPLE_500: BetPurple500,
  BET_YELLOW_1000: BetYellow1000,
  REBUY_CHIP: RebuyChip,
  POKER_TABLE: PokerTable,
  LEAVE_TABLE: LeaveTable,
  CHAT: Chat,
  HISTORY_TABLE: HistoryTable,
  CARDS: (suit: string, value: string) => `/src/assets/images/cards/${suit}/${value}.webp`,
};