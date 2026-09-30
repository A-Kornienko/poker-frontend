
import { useState } from "react";
import Loader from "../components/UI/Loader/Loader";
import JoinTableModal from "../components/Modals/JoinTableModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface CashTableItem {
  settingId: string | number;
  isSeated: boolean;
  buyIn: number;
  smallBlind: number;
  bigBlind: number;
  limitPlayers: number;
  countTables: number;
  countPlayers: number;
}

interface CashTableListProps {
  tables: { items?: CashTableItem[] };
  isTablesLoading: boolean;
  selectedRowId: string | number | null;
  tableInfo: (id: string | number) => void;
  joinToTable: (id: string | number, stack?: number) => void;
  isTableInfo: boolean;
}

const CashTableList: React.FC<CashTableListProps> = ({
  tables,
  isTablesLoading,
  selectedRowId,
  tableInfo,
  joinToTable,
  isTableInfo,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [settingId, setSettingId] = useState<string | number | null>(null);

  const openJoinModal = (settingId: string | number) => {
    setSettingId(settingId);
    setModalOpen(true);
  };

  const handleJoin = (stack: number) => {
    if (settingId !== null) {
      joinToTable(settingId, stack);
      setModalOpen(false);
    }
  };

  const handleJoinTable = (item: CashTableItem) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (item.isSeated) {
      joinToTable(item.settingId);
      return;
    }

    openJoinModal(item.settingId);
  };

  return (
    <>
      <section
        aria-label="Cash tables"
        className={
          "relative h-full min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90 shadow-2xl shadow-black/20 transition-[width] duration-500 ease-in-out " +
          (isTableInfo ? "w-full md:w-2/3" : "w-full")
        }
      >
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">
              Poker lobby
            </p>
            <h1 className="mt-1 text-xl font-semibold text-zinc-100 sm:text-2xl">
              Cash tables
            </h1>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400">
            {tables?.items?.length ?? 0} tables
          </span>
        </header>

        {isTablesLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/50">
            <Loader />
          </div>
        )}
        <div className="myScrollbar h-[calc(100%-81px)] space-y-3 overflow-y-auto p-3 sm:p-5">
          {!isTablesLoading && tables?.items?.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-12 text-center">
              <p className="font-medium text-zinc-200">No tables available</p>
              <p className="mt-1 text-sm text-zinc-500">Please check back soon.</p>
            </div>
          ) : (
            tables?.items?.map((item) => (
              <article
                key={item.settingId}
                className={
                  "grid gap-4 rounded-xl border p-4 transition sm:grid-cols-[repeat(4,minmax(0,1fr))_auto] sm:items-center " +
                  (selectedRowId === item.settingId
                    ? "border-amber-400/40 bg-amber-400/[0.07] shadow-lg shadow-amber-950/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]")
                }
              >
                <div className="grid grid-cols-2 gap-4 sm:col-span-4 sm:grid-cols-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Buy-in</p>
                    <p className="mt-1 text-lg font-semibold text-zinc-100">${item.buyIn}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Blinds</p>
                    <p className="mt-1 text-lg font-medium text-zinc-200">${item.smallBlind} / ${item.bigBlind}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Tables</p>
                    <p className="mt-1 text-lg font-medium text-zinc-200">{item.countTables}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Players</p>
                    <p className="mt-1 flex items-center gap-2 text-lg font-medium text-zinc-200">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                      {item.countPlayers}<span className="text-sm text-zinc-500">/ {item.limitPlayers}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 border-t border-white/10 pt-3 sm:border-0 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => tableInfo(item.settingId)}
                    aria-pressed={selectedRowId === item.settingId}
                    className="flex-1 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-amber-400/40 hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/60 sm:flex-none"
                  >
                    Info
                  </button>
                  <button
                    type="button"
                    onClick={() => handleJoinTable(item)}
                    className="flex-1 rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-zinc-950 sm:flex-none"
                  >
                    Join
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
      {/* Join Table Modal */}
      <JoinTableModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onJoin={handleJoin}
        initialStack={50}
      />
    </>
  );
};

export default CashTableList;
