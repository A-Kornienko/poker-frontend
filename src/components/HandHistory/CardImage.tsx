import { ASSETS } from "../../helpers/assets";
import { HistoryCard } from "../../types/handHistory";

interface CardImageProps {
  card: HistoryCard;
  index: number;
}

export const CardImage = ({ card, index }: CardImageProps) => (
  <img
    src={ASSETS.CARDS(card.suit, card.view)}
    alt={`${card.name} of ${card.suit}`}
    className="h-20 w-14 rounded-md object-cover shadow-lg"
    key={`${card.suit}-${card.value}-${index}`}
  />
);
