import { HistoryAction } from "../../types/handHistory";
import { formatAmount } from "./formatters";

interface ActionListProps {
  actions: HistoryAction[];
}

export const ActionList = ({ actions }: ActionListProps) => (
  <div className="space-y-2">
    {actions.length === 0 ? (
      <p className="text-sm text-zinc-500">No actions recorded</p>
    ) : (
      actions.map((action, index) => (
        <div
          key={`${action.place}-${action.betType}-${index}`}
          className="flex items-center justify-between rounded bg-zinc-900/80 px-3 py-2 text-sm"
        >
          <span className="text-zinc-300">Place {action.place}</span>
          <span className="capitalize text-amber-300">
            {action.betType}
            {action.amount !== null && ` ${formatAmount(action.amount)}`}
          </span>
        </div>
      ))
    )}
  </div>
);
