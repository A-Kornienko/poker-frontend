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
}: HandHistoryItemProps) => {
  const winners = item.winners ?? [];
  const bank = item.bank ?? 0;

  return (
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
          {item.endedAt ? formatDateTime(item.endedAt) : "In progress"}
        </span>
        <div className="space-y-1 text-sm text-zinc-400">
          <span>Winner: {winners.join(", ") || "Unknown"}</span>
          {item.myResult && (
            <span className="block text-[11px] text-zinc-500">
              Result: {item.myResult.deltaChips >= 0 ? "+" : ""}
              {formatAmount(item.myResult.deltaChips)} / Stack {formatAmount(item.myResult.finalStack)}
            </span>
          )}
        </div>
        <span className="text-sm font-semibold text-amber-300">
          Bank: {formatAmount(bank)}
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
};
