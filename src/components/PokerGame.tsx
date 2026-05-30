import { useState, useCallback, useRef, useMemo } from "react";
import TableCards from "./TableCards";
import SeatedPlayers from "./SeatedPlayers";
import { useFetching } from "../hooks/useFetching";
import { useBankAnimation } from "../hooks/useBankAnimation";
import { useWinnerAnimation } from "../hooks/useWinnerAnimation";
import { useTableSSE } from "../hooks/useTableSSE";
import BetService from "../api/BetService";
import { ASSETS } from "../helpers/assets";
import { TableData } from "../types/poker";
import PokerNavBar from "./PokerNavBar";
import TableInfo from "./TableInfo";
import BetControls from "./BetControls";
import ErrorMessage from "./UI/ErrorMessage";
import TablePots from "./TablePots";
import TableBlindChips from "./TableBlindChips";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import RebuyModal from "../components/Modals/RebuyModal";
import RebuyService from "../api/RebuyService";
import CashTablesService from "../api/CashTablesService";
import Loader from "../components/UI/Loader/Loader";

interface PokerTableProps {
  tableId: number;
}

/**
 * Poker Game displays the main interface of the poker table
 * @returns {JSX.Element} Poker Game
 */
export default function PokerTable({ tableId }: PokerTableProps) {
  const navigate = useNavigate();
  const { logout: contextLogout } = useAuth();
  // Initial state of the table
  const [data, setData] = useState<TableData>({
    id: 5,
    name: "Demo Table",
    type: "cash",
    rule: "Texas Holdem",
    style: "table_green",
    turnPlace: 0,
    lastWordPlace: 0,
    dealerPlace: 1,
    smallBlindPlace: 2,
    bigBlindPlace: 3,
    round: "preFlop",
    smallBlind: 1,
    bigBlind: 2,
    currency: "USD",
    limitPlayers: 10,
    countPlayers: 2,
    image: "",
    roundExpirationTime: 0,
    buyIn: 0,
    players: {},
    banks: { rake: 0, items: {} },
    cards: { table: [], player: [] },
    countCards: 2,
    betNavigation: [],
    betRange: { min: 0, max: 0 },
    myPlace: 4,
    myPrize: { rank: 0, sum: 0 },
    spectators: 0,
    maxBet: 2,
    session: null,
    tournament: [],
    playerSetting: [],
    state: "init",
    suggestCombination: "",
    isAuthorized: true,
  });
  const [betAmount, setBetAmount] = useState(0);
  const [stateModalRebuy, setStateModalRebuy] = useState(false);
  const [rebuyErrorsMessage, setRebuyErrorsMessage] = useState("");
  const [LeaveTableErrorsMessage, setLeaveTableErrorsMessage] = useState("");
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  // Refs
  const initialDataLoaded = useRef(false);

  const { animatedBanks, isRakeAnimated } = useBankAnimation(data.banks);
  const winners = useWinnerAnimation(data.banks.items);

  // API bid processing
  const [fetchAction, isActionLoading, actionError] = useFetching(
    async (tableId: number, action: string, betAmount: number) => {
      await BetService.bet(tableId, action, betAmount);
    },
  );

  const [fetchRebuy, isRebuyLoading, rebuyError] = useFetching(
    async (tableId, chips) => {
      setRebuyErrorsMessage("");
      const response = await RebuyService.rebuy(tableId, chips);

      setStateModalRebuy(false);
      if (!response.data.success) {
        setRebuyErrorsMessage(response.data.error);
      }
    },
  );

  const [fetchLeaveTable, isLeaveTableLoading, LeaveTableError] = useFetching(
    async (tableId) => {
      setLeaveTableErrorsMessage("");
      const response = await CashTablesService.leaveTable(tableId);

      if (!response.data.success) {
        setLeaveTableErrorsMessage(response.data.error);
      }

      navigate("/cash-table");
    },
  );

  // Player action processing
  const onAction = useCallback(
    (action: string) => {
      fetchAction(tableId, action, betAmount);
    },
    [tableId, fetchAction, betAmount],
  );

  const minBet = data.betRange?.min || 0;
  const maxBet = data.betRange?.max || 0;
  // Update bet amount
  const handleChange = useCallback(
    (value: number | string) => {
      let val = Number(value);
      if (val < minBet) val = minBet;
      if (val > maxBet) val = maxBet;
      setBetAmount(val);
    },
    [minBet, maxBet],
  );

  // Setting the procent rate
  const handlePercent = useCallback(
    (percent: number) => {
      const val = Math.floor((maxBet * percent) / 100);
      setBetAmount(val);
    },
    [maxBet],
  );

  const handleMessage = useCallback((event: MessageEvent) => {
    const newData: TableData = JSON.parse(event.data);

    setData((prev) => ({ ...prev, ...newData }));

    if (!initialDataLoaded.current) {
      initialDataLoaded.current = true;
      setIsLoadingInitialData(false);
    }
  }, []);

  const handleAuthError = useCallback(() => {
    contextLogout();
    navigate("/login");
  }, [contextLogout, navigate]);

  useTableSSE({
    tableId,
    onMessage: handleMessage,
    onAuthError: handleAuthError,
  });

  const openModalRebuy = () => setStateModalRebuy(true);
  const closeRebuyModal = () => setStateModalRebuy(false);

  const handleRebuy = useCallback(
    (chips: number) => {
      fetchRebuy(data.id, chips);
    },
    [data.id, fetchRebuy],
  );

  const handleLeaveTable = useCallback(() => {
    fetchLeaveTable(data.id);
  }, [data.id, fetchLeaveTable]);

  const handleHistoryTable = useCallback(() => {
    console.log("handleHistoryTable");
  }, []);

  const errorMessages = useMemo(
    () =>
      [
        rebuyErrorsMessage,
        rebuyError?.message,
        actionError?.message,
        LeaveTableError?.message,
        LeaveTableErrorsMessage,
      ].filter((msg): msg is string => Boolean(msg)),
    [
      rebuyErrorsMessage,
      rebuyError,
      actionError,
      LeaveTableError,
      LeaveTableErrorsMessage,
    ],
  );

  const isAnyLoading = isLoadingInitialData || isLeaveTableLoading;

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
      <PokerNavBar
        onRebuyClick={openModalRebuy}
        onPokerHistoryClick={handleHistoryTable}
      />

      {/* Rebuy Modal */}
      <RebuyModal
        isOpen={stateModalRebuy}
        onClose={closeRebuyModal}
        onRebuy={handleRebuy}
        initialStack={50}
        isLoading={isRebuyLoading}
      />

      <TableInfo data={data} />

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
          <TableCards cards={data.cards.table} />

          {/* Blind chips */}
          <TableBlindChips
            dealerPlace={data.dealerPlace}
            smallBlindPlace={data.smallBlindPlace}
            bigBlindPlace={data.bigBlindPlace}
          />

          <SeatedPlayers
            players={data.players}
            myPlace={data.myPlace}
            turnPlace={data.turnPlace}
            currency={data.currency}
            tableCards={data.cards.table}
            holeCards={data.cards.player}
            winners={winners}
          />

          {/* Pots and rake */}
          <TablePots
            banks={data.banks}
            currency={data.currency}
            animatedBanks={animatedBanks}
            isRakeAnimated={isRakeAnimated}
          />
        </div>
      </div>

      {/* Action control */}
      {data.myPlace === data.turnPlace && (
        <BetControls
          data={data}
          betAmount={betAmount}
          minBet={minBet}
          maxBet={maxBet}
          onAction={onAction}
          onChangeBet={handleChange}
          onPercentBet={handlePercent}
          isLoading={isActionLoading}
        />
      )}

      {/* chat and Leave the Table */}
      <div className="fixed bottom-4 left-4 flex gap-4 z-30">
        <button
          onClick={handleLeaveTable}
          className="rounded-full p-2 hover:scale-110 hover:opacity-80 transition-transform duration-300"
          aria-label="leave the table"
        >
          <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10">
            <path
              d="M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z"
              style={{ fill: "#fff" }}
            />
          </svg>
        </button>
        <button
          className="rounded-full p-2 hover:scale-110 hover:opacity-80 transition-transform duration-300"
          aria-label="Chat"
        >
          <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10">
            <path
              d="M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5C5.55,21 2,21 2,21C4.33,18.67 4.7,17.1 4.75,16.5C3.05,15.07 2,13.13 2,11C2,6.58 6.5,3 12,3M17,12V10H15V12H17M13,12V10H11V12H13M9,12V10H7V12H9Z"
              style={{ fill: "#fff" }}
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
