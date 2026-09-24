import { memo } from "react";
import { useTableCards } from "../store/selectors/selectTableCardsState";
import { CardImage } from "./Cards/CardImage";

const TableCards = () => {
  const cards = useTableCards();
  
  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-1/2 top-[40%] -translate-x-1/2 flex gap-2 z-10">
      {cards.map((card, idx) => (
        <CardImage
          key={`${card.suit}-${card.value}`}
          card={card}
          variant="table"
          animate
          animationDelay={idx * 0.2}
          alt={`Table Card ${idx + 1}`}
        />
      ))}
    </div>
  );
};

export default memo(TableCards);
