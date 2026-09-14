import { memo, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Loader from "../components/UI/Loader/Loader";

interface BetControlsProps {
  betNavigation: string[];
  betAmount: number;
  minBet: number;
  maxBet: number;
  onAction: (action: string) => void;
  onChangeBet: (value: number | string) => void;
  onPercentBet: (percent: number) => void;
  isLoading?: boolean;
}

/**
 * BetControls displays betting controls for the current player
 * @returns {JSX.Element} Betting controls
 */
const BetControls = memo(
  ({
    betNavigation,
    betAmount,
    minBet,
    maxBet,
    onAction,
    onChangeBet,
    onPercentBet,
    isLoading = false,
  }: BetControlsProps) => {
    const actionPendingRef = useRef(false);
    const dragStartRef = useRef<{
      startX: number;
      startY: number;
      originX: number;
      originY: number;
    } | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const controlsDisabled = isLoading || actionPendingRef.current;

    useEffect(() => {
      if (!isLoading) {
        actionPendingRef.current = false;
      }
    }, [isLoading]);

    useEffect(() => {
      const handlePointerMove = (event: PointerEvent) => {
        if (!dragStartRef.current) {
          return;
        }

        const deltaX = event.clientX - dragStartRef.current.startX;
        const deltaY = event.clientY - dragStartRef.current.startY;

        setDragOffset({
          x: dragStartRef.current.originX + deltaX,
          y: dragStartRef.current.originY + deltaY,
        });
      };

      const handlePointerUp = () => {
        dragStartRef.current = null;
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);

      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };
    }, []);

    const markActionPending = (pending: boolean) => {
      actionPendingRef.current = pending;
    };

    const handleAction = (action: string) => {
      if (controlsDisabled) return;
      markActionPending(true);
      onAction(action);
    };

    const handleChangeBet = (value: number | string) => {
      if (controlsDisabled) return;
      onChangeBet(value);
    };

    const handleDragStart = (event: ReactPointerEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (target.closest("button") || target.closest("input")) {
        return;
      }

      event.preventDefault();
      dragStartRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        originX: dragOffset.x,
        originY: dragOffset.y,
      };
    };

    // Configuration of betting navigation buttons
    const betNavigationList = [
      {
        label: "FOLD",
        action: "fold",
        classes: "bg-gray-500 text-white hover:bg-gray-400 focus:ring-gray-500",
      },
      {
        label: "CHECK",
        action: "check",
        classes:
          "bg-green-500 text-white hover:bg-gray-500 focus:ring-gray-600",
      },
      {
        label: "CALL",
        action: "call",
        classes:
          "bg-green-500 text-white hover:bg-gray-500 focus:ring-gray-600",
      },
      {
        label: "BET / RAISE",
        action: "raise",
        classes:
          "bg-yellow-500 text-white hover:bg-gray-500 focus:ring-gray-700",
      },
    ];

    // Filter navigation buttons based on available actions
    const betNavigationFiltered = betNavigationList.filter((btn) =>
      betNavigation.includes(btn.action),
    );

    return (
      <>
        <div
          className={`fixed bottom-4 right-4 w-[calc(100%-1.5rem)] max-w-sm p-4 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-800 via-zinc-800 to-zinc-900 shadow-[0_20px_45px_rgba(0,0,0,0.35)] backdrop-blur-sm space-y-3 md:max-w-sm
        ${isLoading ? "opacity-50" : "opacity-100"}`}
          style={{ transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }}
        >
          <div
            className="mb-2 flex cursor-grab items-center justify-center select-none rounded-lg border border-white/10 bg-zinc-950/40 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 active:cursor-grabbing"
            onPointerDown={handleDragStart}
            aria-label="Drag betting controls"
            role="button"
            tabIndex={0}
          >
            <span className="text-zinc-300">⋮⋮⋮</span>
          </div>

          {/* Loader */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center rounded-2xl">
              <Loader />
            </div>
          )}

          {/* Controls for entering the bet amount */}
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/60 p-2 shadow-inner">
            <input
              type="number"
              disabled={isLoading}
              value={betAmount}
              min={minBet}
              max={maxBet}
              onChange={(e) => onChangeBet(e.target.value)}
              className="h-10 w-20 rounded-lg border border-white/10 bg-zinc-900/90 px-2 text-center text-sm font-semibold text-white outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
              aria-label="Bet amount"
            />
            <button
              onClick={() => onChangeBet(betAmount - 1)}
              disabled={isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-zinc-700/80 text-lg font-semibold text-white transition hover:-translate-y-0.5 hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Decrease bet"
            >
              –
            </button>
            <input
              type="range"
              disabled={isLoading}
              min={minBet}
              max={maxBet}
              value={betAmount}
              onChange={(e) => onChangeBet(e.target.value)}
              className="bet-range-slider flex-1"
              aria-label="Bet range slider"
            />
            <button
              onClick={() => onChangeBet(betAmount + 1)}
              disabled={isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-zinc-700/80 text-lg font-semibold text-white transition hover:-translate-y-0.5 hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Increase bet"
            >
              +
            </button>
          </div>

          {/* Buttons for selecting the percentage rate and All-in */}
          <div className="flex gap-2">
            {[20, 40, 60].map((percent) => (
              <button
                key={percent}
                onClick={() => onPercentBet(percent)}
                disabled={isLoading}
                className="flex-1 rounded-xl border border-white/10 bg-zinc-700/80 px-2 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={`Set bet to ${percent}% of max`}
              >
                {percent}%
              </button>
            ))}
            <button
              onClick={() => handleChangeBet(maxBet)}
              disabled={controlsDisabled}
              className="flex-1 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 px-2 py-2 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:from-rose-500 hover:to-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Go all-in"
            >
              All-in
            </button>
          </div>

          {/* Action buttons (Fold, Check/Call, Raise) */}
          <div className="flex gap-2">
            {betNavigationFiltered.map((btn) => (
              <button
                key={btn.action}
                disabled={controlsDisabled}
                onClick={() => handleAction(btn.action)}
                className={`flex-1 rounded-xl border border-white/10 py-2 text-sm font-semibold shadow-md transition hover:-translate-y-0.5 active:translate-y-0.5 ${btn.classes}`}
                aria-label={btn.label}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </>
    );
  },
);

export default BetControls;
