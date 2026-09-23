import Loader from "../UI/Loader/Loader";
import { HandDetails } from "./HandDetails";
import { formatAmount, formatDateTime, shortSession } from "./formatters";
import { HandHistoryDetails, HandHistoryItem as HistoryItem } from "../../types/handHistory";

interface HandHistoryItemProps {
  item: HistoryItem;
  isOpen: boolean;
  details: HandHistoryDetails | null;
  isDetailsLoading: boolean;
  onClick: () => void;
}

export const HandHistoryItem = ({
  item,
  isOpen,
  details,
  isDetailsLoading,
  onClick,
}: HandHistoryItemProps) => (
  <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/70">
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      className="grid w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-zinc-800/80 md:grid-cols-[1.4fr_1.5fr_1fr_1fr_auto]"
    >
      <span className="font-mono text-sm text-zinc-200">{shortSession(item.session)}</span>
      <span className="text-sm text-zinc-400">
        {formatDateTime(item.startedAt)}
        <span className="mx-2 text-zinc-600">-</span>
        {formatDateTime(item.endedAt)}
      </span>
      <span className="text-sm text-zinc-400">
        Winner: {item.winners.join(", ") || "Unknown"}
      </span>
      <span className="text-sm font-semibold text-amber-300">
        Bank: {formatAmount(item.bank)}
      </span>
      <span className="text-xs uppercase tracking-wider text-zinc-500">
        {isOpen ? "Hide" : "View"}
      </span>
    </button>
    {isOpen &&
      (details ? (
        <HandDetails details={details} />
      ) : isDetailsLoading ? (
        <div className="flex justify-center border-t border-amber-500/20 py-10">
          <Loader />
        </div>
      ) : null)}
  </div>
);
