import { memo, useEffect, useState } from "react";
import {
  BAR_COLOR_THRESHOLDS,
  COLORS,
  TIMERS,
} from "../constants/pokerGameConstants";

interface TurnTimerBarProps {
  betExpTime?: number;
}

const TurnTimerBar = ({ betExpTime = 0 }: TurnTimerBarProps) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const initial = betExpTime ?? 0;
    setTimeLeft(initial);
    setTotalTime(initial);
    if (initial <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, TIMERS.TIMER_INTERVAL);

    return () => clearInterval(timer);
  }, [betExpTime]);

  if (totalTime <= 0) {
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
          className={`h-full ${barColor} transition-all duration-1000 ease-linear`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default memo(TurnTimerBar);
