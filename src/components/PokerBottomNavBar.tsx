import { memo } from "react";
import { ASSETS } from "../helpers/assets";

/**
 * PokerBottomNavBar displays icons for leave the table and chat
 * @returns {JSX.Element} PokerBottomNavBar (leave the table, chat)
 */
const PokerBottomNavBar = memo(({ onLeaveTableClick, onChatClick }) => (
  <>
    {/* chat and Leave the Table */}
    <div className="fixed bottom-4 left-4 flex gap-4 z-30">
      <button
        onClick={onLeaveTableClick}
        className="rounded-full p-2 hover:scale-110 hover:opacity-80 transition-transform duration-300"
        aria-label="leave the table"
      >
        <img
          src={ASSETS.LEAVE_TABLE}
          className="h-8 w-8 md:h-10 md:w-10"
          alt="Leave Table"
        />
      </button>
      <button
        onClick={onChatClick}
        className="rounded-full p-2 hover:scale-110 hover:opacity-80 transition-transform duration-300"
        aria-label="Chat"
      >
        <img src={ASSETS.CHAT} className="h-8 w-8 md:h-10 md:w-10" alt="Chat" />
      </button>
    </div>
  </>
));

export default PokerBottomNavBar;
