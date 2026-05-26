import React, { memo } from "react";
import { ASSETS } from "../helpers/assets";
import { Player as PlayerType, Card } from "../types/poker";

interface PlayerProps {
  player: PlayerType;
  myPlace: number;
  cards: { table: Card[]; player: Card[] };
  currency: string;
  isWinner: boolean;
  isTurn: boolean;
  barColor: string;
  percent: number;
}

/**
 * Player displays player data: cards, avatar, stack, bet
 * @returns {JSX.Element} Player element
 */
const Player = memo(
  ({
    player,
    myPlace,
    cards,
    currency,
    isWinner,
    isTurn,
    barColor,
    percent,
  }: PlayerProps) => (
    <div
      className={`player-${
        player.place
      } flex flex-col items-center justify-center z-10 ${
        isWinner ? "my-animate-pulse" : ""
      }`}
    >
      {/* Avatar, Timer and Action */}
      <div className="w-36 h-32 text-center">
        <div className="relative flex justify-center">
          {/* Player cards */}
          <div className="flex w-16 h-24 justify-center">
            {myPlace === Number(player.place) ? (
              cards.player.map((card, i) => (
                <img
                  key={i}
                  src={`${ASSETS.CARDS(card.suit, card.value)}`}
                  alt="Player Card"
                  className="rounded shadow-md my-animate-deal-card"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))
            ) : (
              <>
                <img
                  src={ASSETS.CARD_BACK}
                  alt="Card Back"
                  className="rounded shadow-md my-animate-deal-card"
                  style={{ animationDelay: "0s" }}
                />
                <img
                  src={ASSETS.CARD_BACK}
                  alt="Card Back"
                  className="rounded shadow-md my-animate-deal-card"
                  style={{ animationDelay: "0.2s" }}
                />
              </>
            )}
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-300 ring-2 ring-gray-200">
            <svg
              viewBox="0 0 24 24"
              className="text-gray-400"
              style={{ width: "3rem", height: "3rem" }}
            >
              <path
                d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
                style={{ fill: "#fff" }}
              />
            </svg>
          </div>

          {/* Last Action */}
          {player.betType && (
            <div
              className={`absolute bottom-1 left-1/2 -translate-x-1/2 text-white font-bold text-sm p-0.5 rounded ${
                player.betType === "fold"
                  ? "bg-red-500"
                  : player.betType === "check" || player.betType === "call"
                  ? "bg-green-500"
                  : "bg-yellow-500"
              }`}
            >
              {player.betType}
            </div>
          )}
        </div>

        {/* Name && stack */}
        <div
          className={`relative rounded-b-2xl rounded-t-md font-bold z-10 ${
            isTurn ? "ring-2 ring-green-500 border border-white/10" : ""
          }`}
        >
          <div className="truncate rounded-t-md border-b border-white/10 bg-gray-800 px-1 text-white/60">
            {player.profile.name}
          </div>
          {isTurn && (
            <div className="w-full max-w-md mx-auto">
              <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColor} transition-all duration-1000 ease-linear`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )}
          <div className="rounded-b-2xl bg-gray-600 px-3 py-1">
            <div className="text-blue-300 flex items-center justify-center text-sm">
              {player.stack} {currency}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
);

export default Player;
