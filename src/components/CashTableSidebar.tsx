import React from "react";
import Loader from "../components/UI/Loader/Loader";

interface CashTableSidebarProps {
  isTableInfo: boolean;
  playersInfo: any[];
  isPlayersInfoLoading: boolean;
  getSettingDetails: () => void;
  isSettingDetails: boolean;
  isSettingDetailsLoading: boolean;
  settingDetails: any;
  closeSidebar: () => void;
}

const CashTableSidebar: React.FC<CashTableSidebarProps> = ({
  isTableInfo,
  playersInfo,
  isPlayersInfoLoading,
  getSettingDetails,
  isSettingDetails,
  isSettingDetailsLoading,
  settingDetails,
  closeSidebar,
}) => (
  <aside
    aria-label="Table details"
    className={
      "absolute inset-y-3 right-3 z-20 flex w-[calc(100%-1.5rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/50 transition-all duration-500 ease-in-out md:w-1/3 " +
      (isTableInfo
        ? "translate-x-0 opacity-100"
        : "translate-x-full opacity-0 pointer-events-none")
    }
  >
    <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">Poker lobby</p>
        <h2 className="mt-1 text-lg font-semibold text-zinc-100">Table details</h2>
      </div>
      <button
        type="button"
        onClick={closeSidebar}
        aria-label="Close table details"
        className="rounded-full px-3 pb-1 text-2xl leading-none text-zinc-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400/60"
      >
        &times;
      </button>
    </header>

    <section className="border-b border-white/10 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-200">Players</h3>
        <span className="text-xs text-zinc-500">{playersInfo.length} seated</span>
      </div>
      {isPlayersInfoLoading ? (
        <div className="flex justify-center py-5"><Loader /></div>
      ) : playersInfo.length === 0 ? (
        <p className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-4 text-center text-sm text-zinc-500">
          No players at this table yet.
        </p>
      ) : (
        <ul className="myScrollbar max-h-52 space-y-2 overflow-y-auto">
          {playersInfo.map((player) => (
            <li
              key={player.login}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-200">{player.login}</p>
                <p className="text-xs text-zinc-500">Seat {player.tableId}</p>
              </div>
              <span className="shrink-0 text-sm font-medium text-emerald-300">${player.stack}</span>
            </li>
          ))}
        </ul>
      )}
    </section>

    <button
      type="button"
      onClick={getSettingDetails}
      aria-expanded={isSettingDetails}
      className="flex w-full items-center justify-between border-b border-white/10 px-5 py-4 text-left transition hover:bg-white/[0.04] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-400/60"
    >
      <span className="text-sm font-semibold text-zinc-200">Game information</span>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={`h-5 w-5 text-zinc-400 transition-transform ${isSettingDetails ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    {isSettingDetails && (
      <div className="myScrollbar flex-1 space-y-2 overflow-y-auto p-4">
        {isSettingDetailsLoading ? (
          <div className="flex justify-center py-5"><Loader /></div>
        ) : Object.keys(settingDetails || {}).length > 0 ? (
          <>
            {[
              ["Name", settingDetails.name],
              ["Type", settingDetails.type],
              ["Rules", settingDetails.rule],
              ["Buy-in", `${settingDetails.buyIn} $`],
              ["Blinds", `${settingDetails.smallBlind}$ / ${settingDetails.bigBlind}$`],
              ["Time to move", `${settingDetails.turnTime} sec`],
              ["Time bank", `${settingDetails?.timeBank?.timeLimit} sec`],
              ["Minimum players", "2"],
              ["Currency", settingDetails.currency],
              ["Rake", `${settingDetails.rake}%`],
              ["Rake cap", `${settingDetails.rakeCap}$`],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
                <span className="text-sm text-zinc-500">{label}</span>
                <span className="text-right text-sm font-medium text-zinc-200">{value}</span>
              </div>
            ))}
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3">
              <p className="mb-1 text-sm font-medium text-zinc-300">Hold'em rules</p>
              <p className="text-sm leading-6 text-zinc-500">
                Texas Hold'em uses a standard 52-card deck. Players receive two private cards, then share five community cards across four betting rounds to make the best five-card hand.
              </p>
            </div>
          </>
        ) : (
          <p className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-center text-sm text-zinc-500">
            Table information is unavailable.
          </p>
        )}
      </div>
    )}
  </aside>
);

export default CashTableSidebar;
