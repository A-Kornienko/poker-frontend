import React, { memo } from "react";
import { ASSETS } from "../helpers/assets";

// ChipsBlock displays the player's chip stack
const ChipsBlock = memo(() => (
  <span role="img" aria-label="chips" className="relative cursor-pointer">
    <div className="absolute h-6 w-6" style={{ top: "-18px", right: "-4px" }}>
      <img src={ASSETS.BET_BLACK_100} className="w-full" />
    </div>
    <div className="absolute -top-1 h-6 w-6" style={{ left: "-12px" }}>
      <img src={ASSETS.BET_RED_5} className="w-full" />
    </div>
    <div className="absolute -top-1 h-6 w-6" style={{ right: "4px" }}>
      <img src={ASSETS.BET_YELLOW_50} className="w-full" />
    </div>
  </span>
));

export default ChipsBlock;
