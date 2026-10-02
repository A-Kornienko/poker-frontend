import { memo } from "react";
import {
  BAR_COLOR_THRESHOLDS,
  COLORS,
} from "../constants/pokerGameConstants";
import { useTurnTimer } from "../hooks/useTurnTimer";
import { useTurnTimerBar } from "../hooks/useTurnTimerBar";
import { usePlayerBetExpTime } from "../store/selectors/usePlayerBetExpTime";

interface TurnTimerBarProps {
  playerPlace: string | number;
  isTurn: boolean;
}

const TurnTimerBar = ({ playerPlace, isTurn }: TurnTimerBarProps) => {
  const betExpTime = usePlayerBetExpTime(playerPlace);
  const timerKey = useTurnTimer({ isTurn, betExpTime, playerPlace });
  const { timeLeft, totalTime } = useTurnTimerBar({
    betExpTime,
    timerKey,
    isActive: isTurn,
  });

  if (!isTurn || totalTime <= 0) {
    return null;
  }

  const percent = (timeLeft / totalTime) * 100;
  const barColor =
    percent <= BAR_COLOR_THRESHOLDS.RED
      ? COLORS.BAR_RED
      : percent <= BAR_COLOR_THRESHOLDS.YELLOW
        ? COLORS.BAR_YELLOW
        : COLORS.BAR_GREEN;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
        <div
          key={String(timerKey)}
          className={`h-full ${barColor} transition-all duration-1000 ease-linear`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default memo(TurnTimerBar);
