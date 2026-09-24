import { ASSETS } from "../../helpers/assets";
import { Card } from "../../types/poker";

type CardVariant = "table" | "player" | "history";

interface CardImageProps {
  card?: Card;
  variant: CardVariant;
  hidden?: boolean;
  animate?: boolean;
  animationDelay?: number;
  className?: string;
  alt?: string;
}

const variantClasses: Record<CardVariant, string> = {
  table: "h-20 w-12 rounded shadow-md object-cover md:h-24 md:w-16",
  player: "h-24 w-16 rounded shadow-md object-cover",
  history: "h-20 w-14 rounded-md object-cover shadow-lg",
};

const mergeCardClasses = (...classNames: Array<string | false | undefined>) => {
  const overridePrefixes = ["h-", "w-", "rounded", "shadow", "object-"];
  const classes = classNames.filter(Boolean).flatMap((className) =>
    typeof className === "string" ? className.split(" ") : [],
  );

  const getClassGroup = (className: string) => {
    const utility = className.slice(className.lastIndexOf(":") + 1);

    return overridePrefixes.find((prefix) => utility.startsWith(prefix));
  };

  return classes.reduce<string[]>((merged, className) => {
    const variants = className.includes(":")
      ? className.slice(0, className.lastIndexOf(":"))
      : "";
    const classGroup = getClassGroup(className);

    if (classGroup) {
      return [
        ...merged.filter((existingClass) => {
          const existingVariants = existingClass.includes(":")
            ? existingClass.slice(0, existingClass.lastIndexOf(":"))
            : "";

          return (
            existingVariants !== variants ||
            getClassGroup(existingClass) !== classGroup
          );
        }),
        className,
      ];
    }

    return [...merged, className];
  }, []).join(" ");
};

export const CardImage = ({
  card,
  variant,
  hidden = false,
  animate = false,
  animationDelay,
  className,
  alt,
}: CardImageProps) => {
  if (!hidden && !card) {
    return null;
  }

  const cardAlt = hidden
    ? "Card back"
    : alt ?? `${card?.value} of ${card?.suit}`;

  return (
    <img
      src={
        hidden
          ? ASSETS.CARD_BACK
          : ASSETS.CARDS(card!.suit, card!.view ?? card!.value)
      }
      alt={cardAlt}
      className={mergeCardClasses(
        variantClasses[variant],
        animate && "my-animate-deal-card",
        className,
      )}
      style={
        animationDelay === undefined
          ? undefined
          : { animationDelay: `${animationDelay}s` }
      }
    />
  );
};