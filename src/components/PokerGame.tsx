import { useCallback, useMemo } from "react";
import TableCards from "./TableCards";
import SeatedPlayers from "./SeatedPlayers";
import { ASSETS } from "../helpers/assets";
import PokerTopNavBar from "./PokerTopNavBar";
import PokerBottomNavBar from "./PokerBottomNavBar";
import TableInfo from "./TableInfo";
import BetControls from "./BetControls";
import ErrorMessage from "./UI/ErrorMessage";
import TablePots from "./TablePots";
import TableBlindChips from "./TableBlindChips";
import { useNavigate } from "react-router-dom";
import RebuyModal from "../components/Modals/RebuyModal";
import Loader from "../components/UI/Loader/Loader";
import { useTableState } from "../store/selectors/selectTableState";
import { useBankAnimation } from "../hooks/useBankAnimation";
import { useRebuy } from "../hooks/useRebuy";
import { useLeaveTable } from "../hooks/useLeaveTable";
import { useBetting } from "../hooks/useBetting";
import { useTableConnection } from "../hooks/useTableConnection";

interface PokerTableProps {
  tableId: number;
}

/**
 * Poker Game displays the main interface of the poker table
 * @returns {JSX.Element} Poker Game
 */
export default function PokerTable({ tableId }: PokerTableProps) {
  const navigate = useNavigate();
  // Initial state of the table
  const data = useTableState();

  const { animatedBanks, isRakeAnimated } = useBankAnimation(data.banks);

  // Rebuy hook
  const rebuy = useRebuy(tableId);

  // Leave table hook
  const leaveTable = useLeaveTable(tableId, () => navigate("/cash-table"));

  // Player action processing
  const betting = useBetting(tableId, data.betRange);

  // Subscribe to table updates via SSE
  const tableConnection = useTableConnection({
    tableId,
  });

  const handleChat = useCallback(() => {
    console.log("handleChat");
  }, [tableId]);

  const handleHistoryTable = useCallback(() => {
    console.log("handleHistoryTable");
  }, []);

  const errorMessages = useMemo(
    () =>
      [
        rebuy.errorMessage,
        rebuy.error?.message,
        betting.error?.message,
        leaveTable.error?.message,
        leaveTable.errorMessage,
      ].filter((msg): msg is string => Boolean(msg)),
    [
      rebuy.errorMessage,
      rebuy.error,
      betting.error,
      leaveTable.error,
      leaveTable.errorMessage,
    ],
  );

  const isAnyLoading = tableConnection.isInitialLoading || leaveTable.isLoading;

  return (
    <div className="relative h-vh-fullScreen bg-zinc-900">
      {/* errors messages */}
      {errorMessages.map((err, idx) => (
        <div key={idx}>
          <ErrorMessage message={err} />
        </div>
      ))}

      {/* Loader */}
      {isAnyLoading && (
        <div className="absolute w-full h-vh-fullScreen bg-black opacity-50 z-20">
          <div className="absolute top-1/4 left-1/2">
            <Loader />
          </div>
        </div>
      )}

      {/* Poker  */}
      <PokerTopNavBar
        onRebuyClick={rebuy.openModal}
        onPokerHistoryClick={handleHistoryTable}
      />

      {/* Rebuy Modal */}
      <RebuyModal
        isOpen={rebuy.isOpen}
        onClose={rebuy.closeModal}
        onRebuy={rebuy.rebuy}
        initialStack={50}
        isLoading={rebuy.isLoading}
      />

      {/* for test und debag */}
      <TableInfo />

      {/* table */}
      <div className="flex justify-center items-center mt-4">
        <div className="relative w-full max-w-[70vw] aspect-[5/3] grid grid-cols-10 grid-rows-6 gap-1">
          {/* Table background */}
          <img
            src={ASSETS.POKER_TABLE}
            alt="Poker Table"
            className="absolute inset-0 w-full h-full object-contain z-0"
          />

          {/* Table cards */}
          <TableCards />

          {/* Blind chips */}
          <TableBlindChips />

          <SeatedPlayers />

          {/* Pots and rake */}
          <TablePots
            animatedBanks={animatedBanks}
            isRakeAnimated={isRakeAnimated}
          />
        </div>
      </div>

      {/* Action control */}
      {data.myTurn && (
        <BetControls
          betNavigation={data.betNavigation}
          betAmount={betting.betAmount}
          minBet={betting.minBet}
          maxBet={betting.maxBet}
          onAction={betting.onAction}
          onChangeBet={betting.onChangeBet}
          onPercentBet={betting.onPercentBet}
          isLoading={betting.isLoading}
        />
      )}

      <PokerBottomNavBar
        onLeaveTableClick={leaveTable.leaveTable}
        onChatClick={handleChat}
      />
    </div>
  );
}
