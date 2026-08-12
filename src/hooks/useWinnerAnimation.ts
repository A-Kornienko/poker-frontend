import { useEffect, useRef } from "react";
import { TIMERS } from "../constants/pokerGameConstants";

type UseWinnerAnimationProps = {
  isActive: boolean;
  onComplete: () => void;
};

export const useWinnerAnimation = ({
  isActive,
  onComplete,
}: UseWinnerAnimationProps) => {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      onComplete();
    }, TIMERS.WINNERS_DISPLAY);

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isActive, onComplete]);
};