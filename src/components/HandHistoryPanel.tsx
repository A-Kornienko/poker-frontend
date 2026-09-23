import { useCallback, useEffect, useState } from "react";
import HandHistoryService, {
  HandHistoryPage,
} from "../api/HandHistoryService";
import ErrorMessage from "./UI/ErrorMessage";
import Loader from "./UI/Loader/Loader";
import { ASSETS } from "../helpers/assets";
import {
  HandHistoryDetails,
  HandHistoryItem,
  HistoryAction,
  HistoryCard,
} from "../types/handHistory";

interface HandHistoryPanelProps {
  tableId: number;
  onClose: () => void;
}

const formatAmount = (amount: number): string => {
  const numericAmount = Number(amount);

  return Number.isInteger(numericAmount)
    ? numericAmount.toString()
    : numericAmount.toFixed(2);
};

const shortSession = (session: string): string =>
  `${session.slice(0, 8)}...${session.slice(-6)}`;

const getDateTimeValue = (value: string): number | null => {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/,
  );

  if (!match) return null;

  const [, year, month, day, hours, minutes, seconds = "0"] = match;
  const localDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    Number(seconds),
  );

  const timestamp = localDate.getTime();
  
  return Number.isNaN(timestamp) ? null : timestamp;
};

const formatDateForApi = (value: string): string | undefined => {
  const timestamp = getDateTimeValue(value);

  return timestamp === null ? undefined : new Date(timestamp).toISOString();
};

const formatDateTime = (value: string | number): string => {
  const numericValue = Number(value);
  const date =
    typeof value === "number" || !Number.isNaN(numericValue)
      ? new Date(numericValue < 1_000_000_000_000 ? numericValue * 1000 : numericValue)
      : new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown time";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

const CardImage = ({ card, index }: { card: HistoryCard; index: number }) => (
  <img
    src={ASSETS.CARDS(card.suit, card.view)}
    alt={`${card.name} of ${card.suit}`}
    className="h-20 w-14 rounded-md object-cover shadow-lg"
    key={`${card.suit}-${card.value}-${index}`}
  />
);

const ActionList = ({ actions }: { actions: HistoryAction[] }) => (
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

const HandDetails = ({ details }: { details: HandHistoryDetails }) => (
  <div className="space-y-6 border-t border-amber-500/20 bg-zinc-950/60 p-5">
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
        Table cards
      </h3>
      <div className="flex flex-wrap gap-2">
        {details.cards.map((card, index) => (
          <CardImage card={card} index={index} key={`${card.suit}-${card.value}`} />
        ))}
      </div>
    </section>

    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
        Players
      </h3>
      <div className="grid gap-3 md:grid-cols-2">
        {Object.values(details.players).map((player) => (
          <div
            key={player.place}
            className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-4"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-zinc-100">
                  {player.login}
                  {player.isMyPlayer && (
                    <span className="ml-2 text-xs font-normal text-amber-400">
                      You
                    </span>
                  )}
                </p>
                <p className="text-xs text-zinc-500">
                  Place {player.place} - {player.position || "No position"}
                </p>
              </div>
              <p className="text-sm text-amber-300">
                Stack {formatAmount(player.stack)}
              </p>
            </div>
            <div className="flex min-h-20 gap-2">
              {player.cards.length > 0 ? (
                player.cards.map((card, index) => (
                  <CardImage
                    card={card}
                    index={index}
                    key={`${card.suit}-${card.value}`}
                  />
                ))
              ) : (
                <p className="self-center text-sm text-zinc-500">
                  Cards not revealed
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="grid gap-4 md:grid-cols-2">
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
          Table info
        </h3>
        <div className="space-y-2 text-sm text-zinc-300">
          <p>Dealer: place {details.dealer}</p>
          <p>
            Blinds: {formatAmount(details.blinds.smallBlind)} / {formatAmount(details.blinds.bigBlind)}
          </p>
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
          Pots by street
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-zinc-300">
          <p>Preflop: {formatAmount(details.pot.preFlop)}</p>
          <p>Flop: {formatAmount(details.pot.flop)}</p>
          <p>Turn: {formatAmount(details.pot.turn)}</p>
          <p>River: {formatAmount(details.pot.river)}</p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
        Actions
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        {(
          [
            ["Preflop", details.preflop],
            ["Flop", details.flop],
            ["Turn", details.turn],
            ["River", details.river],
          ] as const
        ).map(([street, actions]) => (
          <div key={street}>
            <h4 className="mb-2 text-sm font-semibold text-zinc-200">{street}</h4>
            <ActionList actions={actions} />
          </div>
        ))}
      </div>
    </section>

    <section className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
        Winner
      </h3>
      <div className="space-y-4">
        {details.winners.map((winner) => (
          <div key={winner.login} className="flex flex-wrap justify-between gap-4">
            <div>
              <p className="font-semibold text-zinc-100">{winner.login}</p>
              <p className="text-sm text-amber-300">
                {winner.combination?.name ?? "Combination unavailable"}
              </p>
            </div>
            <p className="font-semibold text-amber-300">
              +{formatAmount(winner.sum)}
            </p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const HandHistoryPanel = ({ tableId, onClose }: HandHistoryPanelProps) => {
  const [history, setHistory] = useState<HandHistoryPage | null>(null);
  const [openSession, setOpenSession] = useState<string | null>(null);
  const [details, setDetails] = useState<HandHistoryDetails | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activeDateFrom, setActiveDateFrom] = useState("");
  const [activeDateTo, setActiveDateTo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dateFromValue = getDateTimeValue(dateFrom);
  const dateToValue = getDateTimeValue(dateTo);
  const isDateRangeInvalid = Boolean(
    dateFromValue !== null &&
      dateToValue !== null &&
      dateFromValue > dateToValue,
  );

  const hasActiveDateFilter = Boolean(activeDateFrom || activeDateTo);

  const loadHistory = useCallback(async (page = 1, dateRange = {}) => {
    setIsLoading(page === 1);
    setIsPageLoading(page > 1);
    setError(null);
    setOpenSession(null);
    setDetails(null);

    try {
      setHistory(
        await HandHistoryService.getTableHistory(tableId, page, 20, dateRange),
      );
    } catch {
      setError("Unable to load hand history.");
    } finally {
      setIsLoading(false);
      setIsPageLoading(false);
    }
  }, [tableId]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const handleSessionClick = async (session: string) => {
    if (openSession === session) {
      setOpenSession(null);
      setDetails(null);
      setIsDetailsLoading(false);
      return;
    }

    setOpenSession(session);
    setDetails(null);
    setIsDetailsLoading(true);
    setError(null);

    try {
      setDetails(await HandHistoryService.getDetails(session));
    } catch {
      setError("Unable to load hand details.");
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const applyDateFilter = () => {
    if (isDateRangeInvalid) return;

    const apiDateFrom = formatDateForApi(dateFrom);
    const apiDateTo = formatDateForApi(dateTo);

    setActiveDateFrom(apiDateFrom ?? "");
    setActiveDateTo(apiDateTo ?? "");
    void loadHistory(1, { dateFrom: apiDateFrom, dateTo: apiDateTo });
  };

  const resetDateFilter = () => {
    setDateFrom("");
    setDateTo("");
    setActiveDateFrom("");
    setActiveDateTo("");
    void loadHistory(1, { dateFrom: "", dateTo: "" });
  };

  const changePage = (page: number) => {
    if (!history || page < 1 || page > history.pagination.pages) return;
    void loadHistory(page, {
      dateFrom: activeDateFrom,
      dateTo: activeDateTo,
    });
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/80 p-4 md:p-8">
      <div className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden rounded-xl border border-amber-500/20 bg-zinc-950 shadow-2xl shadow-black/60">
        <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              Poker table
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-zinc-100">
              Hand history
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close hand history"
            className="rounded-md p-2 text-2xl leading-none text-zinc-400 transition hover:bg-zinc-800 hover:text-amber-300"
          >
            X
          </button>
        </header>

        {error && <ErrorMessage message={error} />}

        <div className="flex flex-wrap items-end gap-3 border-b border-zinc-800 px-6 py-4">
          <label className="flex flex-col gap-1 text-xs uppercase tracking-wider text-zinc-500">
            From
            <input
              type="datetime-local"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={(event) => setDateFrom(event.target.value)}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm normal-case tracking-normal text-zinc-200 outline-none accent-amber-500 focus:border-amber-500 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:brightness-150 [&::-webkit-calendar-picker-indicator]:sepia [&::-webkit-calendar-picker-indicator]:saturate-[5] [&::-webkit-calendar-picker-indicator]:hue-rotate-[355deg]"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-wider text-zinc-500">
            To
            <input
              type="datetime-local"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(event) => setDateTo(event.target.value)}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm normal-case tracking-normal text-zinc-200 outline-none accent-amber-500 focus:border-amber-500 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:brightness-150 [&::-webkit-calendar-picker-indicator]:sepia [&::-webkit-calendar-picker-indicator]:saturate-[5] [&::-webkit-calendar-picker-indicator]:hue-rotate-[355deg]"
            />
          </label>
          <button
            type="button"
            onClick={applyDateFilter}
            disabled={isDateRangeInvalid}
            className="rounded-md bg-amber-500 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={resetDateFilter}
            className="rounded-md border border-zinc-700 px-5 py-2 text-sm font-semibold text-zinc-300 transition hover:border-amber-500 hover:text-amber-300"
          >
            Reset
          </button>
          {isDateRangeInvalid && (
            <p className="basis-full text-sm text-red-400">
              The start date must be earlier than the end date.
            </p>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader /></div>
          ) : history?.items.length === 0 ? (
            <p className="py-16 text-center text-zinc-500">
              {hasActiveDateFilter ? "No hands found for selected dates" : "No hand history yet"}
            </p>
          ) : (
            <div className="space-y-3">
              {history?.items.map((item: HandHistoryItem) => (
                <div
                  key={item.session}
                  className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/70"
                >
                  <button
                    type="button"
                    onClick={() => void handleSessionClick(item.session)}
                    aria-expanded={openSession === item.session}
                    className="grid w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-zinc-800/80 md:grid-cols-[1.4fr_1.5fr_1fr_1fr_auto]"
                  >
                    <span className="font-mono text-sm text-zinc-200">
                      {shortSession(item.session)}
                    </span>
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
                      {openSession === item.session ? "Hide" : "View"}
                    </span>
                  </button>
                  {openSession === item.session && (
                    details ? <HandDetails details={details} /> : isDetailsLoading ? (
                      <div className="flex justify-center border-t border-amber-500/20 py-10">
                        <Loader />
                      </div>
                    ) : null
                  )}
                </div>
              ))}

              {history && history.pagination.pages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => changePage(history.pagination.page - 1)}
                    disabled={history.pagination.page === 1 || isPageLoading}
                    className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-amber-500 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-zinc-500">
                    Page {history.pagination.page} of {history.pagination.pages}
                  </span>
                  <button
                    type="button"
                    onClick={() => changePage(history.pagination.page + 1)}
                    disabled={history.pagination.page === history.pagination.pages || isPageLoading}
                    className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-amber-500 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
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
