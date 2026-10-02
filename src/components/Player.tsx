import { memo } from "react";
import { useTurnTimer } from "../hooks/useTurnTimer";
import { Player as PlayerType, Card } from "../types/poker";
import TurnTimerBar from "./TurnTimerBar";
import { CardImage } from "./Cards/CardImage";

const LAST_ACTION_BASE_CLASS =
  "absolute bottom-1 left-1/2 -translate-x-1/2 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-950 shadow-lg";

const LAST_ACTION_STYLES: Record<string, string> = {
  fold: "border-red-300/30 bg-red-400",
  check: "border-emerald-300/30 bg-emerald-400",
  call: "border-emerald-300/30 bg-emerald-400",
  default: "border-amber-300/30 bg-amber-400",
};

const getLastActionClass = (betType?: string): string =>
  LAST_ACTION_STYLES[betType?.toLowerCase() ?? ""] ?? LAST_ACTION_STYLES.default;

interface PlayerProps {
  player: PlayerType;
  myPlace: number;
  cards: { table: Card[]; player: Card[] };
  currency: string;
  isWinner: boolean;
  isTurn: boolean;
  state: string;
  betExpTime?: number;
}

/**
 * Player displays player data: cards, avatar, stack, bet
 * @returns {JSX.Element} Player element
 */
const Player = memo(
  ({
    player,
    cards,
    currency,
    isWinner,
    isTurn,
    state,
    betExpTime,
  }: PlayerProps) => {
    const timerKey = useTurnTimer({
      isTurn,
      betExpTime,
      playerPlace: player.place,
    });

    const normalizedState = (state ?? "").toLowerCase();
    const heroHoleCards = Array.isArray(cards.player) ? cards.player : [];
    const playerHoleCards = Array.isArray(player.cards) ? player.cards : [];
    const visiblePlayerCards =
      playerHoleCards.length > 0
        ? playerHoleCards
        : heroHoleCards.length > 0
          ? heroHoleCards
          : [];

    const activeStates = ["run"];
    const isActiveRound = activeStates.some((currentState) =>
      normalizedState.includes(currentState),
    );

    const shouldRevealCards =
      playerHoleCards.length > 0 || heroHoleCards.length > 0;
    const shouldShowBacks = isActiveRound && !shouldRevealCards;

    return (
      <div
        className={`player-${
          player.place
        } z-10 flex flex-col items-center justify-center ${
          isWinner ? "my-animate-pulse" : ""
        }`}
      >
        {/* Avatar, Timer and Action */}
        <div className="w-36 text-center">
          <div className="relative flex h-24 justify-center">
            {/* Player cards */}
            <div className="flex h-24 w-16 justify-center">
              {shouldRevealCards ? (
                visiblePlayerCards.map((card, i) => {
                  return (
                    <CardImage
                      key={`${card.suit}-${card.value}-${i}`}
                      card={card}
                      variant="player"
                      animate
                      animationDelay={i * 0.2}
                      alt="Player card"
                    />
                  );
                })
              ) : shouldShowBacks ? (
                <>
                  <CardImage
                    variant="player"
                    hidden
                  />
                  <CardImage
                    variant="player"
                    hidden
                  />
                </>
              ) : null}
            </div>

            {/* Avatar */}
            <div
              className={`absolute -bottom-3 flex h-16 w-16 items-center justify-center rounded-full border bg-zinc-900/95 shadow-xl shadow-black/30 transition-all ${
                isWinner
                  ? "border-amber-300/80 ring-2 ring-amber-400/50"
                  : isTurn
                    ? "border-emerald-300/80 ring-2 ring-emerald-400/50 shadow-emerald-950/40"
                    : "border-white/15 ring-2 ring-zinc-950/80"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-12 w-12 ${
                  isWinner
                    ? "text-amber-300"
                    : isTurn
                      ? "text-emerald-300"
                      : "text-zinc-500"
                }`}
                style={{ width: "3rem", height: "3rem" }}
              >
                <path
                  d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            {/* Last Action */}
            {player.betType && (
              <div className={`${LAST_ACTION_BASE_CLASS} ${getLastActionClass(player.betType)}`}>
                {player.betType}
              </div>
            )}
          </div>

          {/* Name && stack */}
          <div
            className={`relative z-10 overflow-hidden rounded-xl border bg-zinc-950/90 font-bold shadow-xl shadow-black/30 backdrop-blur-sm ${
              isWinner
                ? "border-amber-300/70 border-t-2 border-t-amber-300 bg-gradient-to-b from-amber-400/25 via-zinc-800/95 to-zinc-900/95 shadow-amber-950/40"
                : isTurn
                  ? "border-emerald-300/70 border-t-2 border-t-emerald-300 bg-gradient-to-b from-emerald-400/25 via-zinc-800/95 to-zinc-900/95 shadow-emerald-950/40 ring-1 ring-emerald-400/30"
                  : "border-zinc-800 border-t-2 border-t-amber-400/70 bg-gradient-to-b from-amber-400/15 via-zinc-800/95 to-zinc-900/95 shadow-black/40"
            }`}
          >
            <div className="truncate border-b border-zinc-700/80 bg-black/20 px-2 py-1.5 text-xs font-semibold text-amber-100">
              {player.profile.name}
            </div>
            {isTurn && (
              <TurnTimerBar betExpTime={betExpTime} timerKey={timerKey} />
            )}
            <div className="bg-black/20 px-3 py-1.5">
              <div className="flex items-center justify-center text-sm font-bold text-amber-300 drop-shadow-[0_1px_4px_rgba(251,191,36,0.25)]">
                {player.stack} {currency}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default Player;
