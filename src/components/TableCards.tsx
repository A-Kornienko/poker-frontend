import { memo } from "react";
import { ASSETS } from "../helpers/assets";
import { Card } from "../types/poker";

interface TableCardsProps {
  cards: Card[];
}

const TableCards = ({ cards }: TableCardsProps) => {
  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-1/2 top-[40%] -translate-x-1/2 flex gap-2 z-10">
      {cards.map((card, idx) => (
        <img
          key={idx}
          src={ASSETS.CARDS(card.suit, card.value)}
          alt={`Table Card ${idx + 1}`}
          className="w-12 h-20 rounded shadow-md my-animate-deal-card md:w-16 md:h-24"
          style={{ animationDelay: `${idx * 0.2}s` }}
        />
      ))}
    </div>
  );
};

export default memo(TableCards);
