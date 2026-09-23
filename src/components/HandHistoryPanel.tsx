import ErrorMessage from "./UI/ErrorMessage";
import Loader from "./UI/Loader/Loader";
import { HandHistoryFilters } from "./HandHistory/HandHistoryFilters";
import { HandHistoryItem as HandHistoryItemComponent } from "./HandHistory/HandHistoryItem";
import { useHandHistory } from "../hooks/useHandHistory";

interface HandHistoryPanelProps {
  tableId: number;
  onClose: () => void;
}

const HandHistoryPanel = ({ tableId, onClose }: HandHistoryPanelProps) => {
  const {
    history,
    openSession,
    details,
    isDetailsLoading,
    isLoading,
    isPageLoading,
    dateFrom,
    dateTo,
    error,
    isDateRangeInvalid,
    hasActiveDateFilter,
    setDateFrom,
    setDateTo,
    handleSessionClick,
    applyDateFilter,
    resetDateFilter,
    changePage,
  } = useHandHistory(tableId);

  return (
    <div className="fixed inset-0 z-40 bg-black/80 p-4 md:p-8">
      <div className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden rounded-xl border border-amber-500/20 bg-zinc-950 shadow-2xl shadow-black/60">
        <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">Poker table</p>
            <h2 className="mt-1 text-2xl font-semibold text-zinc-100">Hand history</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close hand history" className="rounded-md p-2 text-2xl leading-none text-zinc-400 transition hover:bg-zinc-800 hover:text-amber-300">X</button>
        </header>

        {error && <ErrorMessage message={error} />}
        <HandHistoryFilters
          dateFrom={dateFrom}
          dateTo={dateTo}
          isDateRangeInvalid={isDateRangeInvalid}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onApply={applyDateFilter}
          onReset={resetDateFilter}
        />

        <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader /></div>
          ) : history?.items.length === 0 ? (
            <p className="py-16 text-center text-zinc-500">
              {hasActiveDateFilter ? "No hands found for selected dates" : "No hand history yet"}
            </p>
          ) : (
            <div className="space-y-3">
              {history?.items.map((item) => (
                <HandHistoryItemComponent
                  key={item.session}
                  item={item}
                  isOpen={openSession === item.session}
                  details={details}
                  isDetailsLoading={isDetailsLoading}
                  onClick={() => void handleSessionClick(item.session)}
                />
              ))}
              {history && history.pagination.pages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-4">
                  <button type="button" onClick={() => changePage(history.pagination.page - 1)} disabled={history.pagination.page === 1 || isPageLoading} className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-amber-500 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
                  <span className="text-sm text-zinc-500">Page {history.pagination.page} of {history.pagination.pages}</span>
                  <button type="button" onClick={() => changePage(history.pagination.page + 1)} disabled={history.pagination.page === history.pagination.pages || isPageLoading} className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-amber-500 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HandHistoryPanel;
