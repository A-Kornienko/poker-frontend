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
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setOpenSession(null);
    setDetails(null);

    try {
      setHistory(await HandHistoryService.getTableHistory(tableId));
    } catch {
      setError("Unable to load hand history.");
    } finally {
      setIsLoading(false);
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

  const loadMore = async () => {
    if (!history || history.pagination.page >= history.pagination.pages) return;

    setIsLoadingMore(true);
    setError(null);
    try {
      const nextPage = await HandHistoryService.getTableHistory(
        tableId,
        history.pagination.page + 1,
      );
      setHistory({
        items: [...history.items, ...nextPage.items],
        pagination: nextPage.pagination,
      });
    } catch {
      setError("Unable to load more hand history.");
    } finally {
      setIsLoadingMore(false);
    }
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

        <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader /></div>
          ) : history?.items.length === 0 ? (
            <p className="py-16 text-center text-zinc-500">No hand history yet</p>
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
                    className="grid w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-zinc-800/80 md:grid-cols-[1.5fr_1fr_1fr_auto]"
                  >
                    <span className="font-mono text-sm text-zinc-200">
                      {shortSession(item.session)}
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

              {history && history.pagination.page < history.pagination.pages && (
                <button
                  type="button"
                  onClick={() => void loadMore()}
                  disabled={isLoadingMore}
                  className="mx-auto mt-6 block rounded-md border border-amber-500/50 px-5 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoadingMore ? "Loading..." : "Load more"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HandHistoryPanel;
