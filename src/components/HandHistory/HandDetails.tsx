import { ActionList } from "./ActionList";
import { CardImage } from "./CardImage";
import { formatAmount } from "./formatters";
import { HandHistoryDetails } from "../../types/handHistory";

interface HandDetailsProps {
  details: HandHistoryDetails;
}

export const HandDetails = ({ details }: HandDetailsProps) => (
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
