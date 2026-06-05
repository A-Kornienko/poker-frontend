import { memo } from "react";
import { ASSETS } from "../helpers/assets";

/**
 * PokerTopNavBar displays icons for rebuys and settings
 * @returns {JSX.Element} PokerTopNavBar (rebuys, settings)
 */
const PokerTopNavBar = memo(({ onRebuyClick, onSettingsClick }) => (
  <>
    <div className="flex justify-end items-center px-4 py-2 md:px-8 md:py-4">
      <div className="flex gap-4 items-center">
        <button
          onClick={onRebuyClick}
          className="hover:scale-110 hover:opacity-80 transition-transform duration-300"
          type="button"
          role="img"
          aria-label="rebuy"
        >
          <img
            src={ASSETS.REBUY_CHIP}
            className="h-8 w-8 md:h-10 md:w-10"
            alt="Rebuy Chip"
          />
        </button>
        <button
          onClick={onSettingsClick}
          className="hover:scale-110 hover:opacity-80 transition-transform duration-300"
          type="button"
          role="img"
          aria-label="settings"
        >
          <img
            src={ASSETS.SETTINGS}
            className="h-8 w-8 md:h-10 md:w-10"
            alt="Settings"
          />
        </button>
      </div>
    </div>
  </>
));

export default PokerTopNavBar;
