import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useFetching } from "../hooks/useFetching";
import BetService from "../api/BetService";
import TableStateService from "../api/TableStateService";
import { ASSETS } from "../helpers/assets";
import { TableData, Bank } from "../types/poker";
import PokerNavBar from "./PokerNavBar";
import TableInfo from "./TableInfo";
import Player from "./Player";
import BetControls from "./BetControls";
import ErrorMessage from "./UI/ErrorMessage";
import BlindChip from "./BlindChip";
import ChipsBlock from "./ChipsBlock";
import UserService from "../api/Auth/UserService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import RebuyModal from "../components/Modals/RebuyModal";
import RebuyService from "../api/RebuyService";
import CashTablesService from "../api/CashTablesService";
import Loader from "../components/UI/Loader/Loader";

// Improved player and chip positioning
type GridAreaType = "player" | "blindChip" | "betChip";

const getGridArea = (place: number, type: GridAreaType = "player"): string => {
  const positions: { [key in GridAreaType]: { [key: number]: string } } = {
    player: {
      1: "5 / 5 / 7 / 7",
      2: "5 / 7 / 7 / 9",
      3: "4 / 10 / 5 / 11",
      4: "2 / 10 / 4 / 11",
      5: "1 / 7 / 2 / 9",
      6: "1 / 5 / 2 / 7",
      7: "1 / 3 / 2 / 5",
      8: "2 / 1 / 4 / 2",
      9: "4 / 1 / 5 / 2",
      10: "5 / 3 / 7 / 5",
    },
    blindChip: {
      1: "4 / 3 / 6 / 8",
      2: "4 / 7 / 6 / 7",
      3: "4 / 9 / 6 / 9",
      4: "3 / 9 / 4 / 10",
      5: "2 / 7 / 3 / 8",
      6: "2 / 5 / 3 / 6",
      7: "2 / 3 / 3 / 4",
      8: "3 / 2 / 4 / 3",
      9: "4 / 2 / 6 / 3",
      10: "4 / 3 / 6 / 4",
    },
    betChip: {
      1: "4 / 5 / 6 / 8",
      2: "4 / 8 / 6 / 9",
      3: "4 / 9 / 5 / 10",
      4: "2 / 9 / 4 / 10",
      5: "2 / 8 / 3 / 9",
      6: "2 / 6 / 3 / 6",
      7: "2 / 4 / 3 / 4",
      8: "2 / 2 / 4 / 3",
      9: "4 / 2 / 5 / 3",
      10: "4 / 4 / 6 / 4",
    },
  };

  return positions[type][place] || "3 / 5";
};

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
  const [banks, setBanks] = useState<Bank>(data.banks);
  const [animatedBanks, setAnimatedBanks] = useState<{
    [key: string]: boolean;
  }>({});
  const [isRakeAnimated, setIsRakeAnimated] = useState(false);
  const [winners, setWinners] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [stateModalRebuy, setStateModalRebuy] = useState(false);
  const [rebuyErrorsMessage, setRebuyErrorsMessage] = useState("");
  const [LeaveTableErrorsMessage, setLeaveTableErrorsMessage] = useState("");
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const initialDataLoaded = useRef(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  // API bid processing
  const [fetchAction, isActionLoading, actionError] = useFetching(
    async (tableId: number, action: string, betAmount: number) => {
      await BetService.bet(tableId, action, betAmount);
    }
  );

  const [fetchRebuy, isRebuyLoading, rebuyError] = useFetching(
    async (tableId, chips) => {
      setRebuyErrorsMessage("");
      const response = await RebuyService.rebuy(tableId, chips);

      setStateModalRebuy(false);
      if (!response.data.success) {
        setRebuyErrorsMessage(response.data.error);
      }
    }
  );

  const [fetchLeaveTable, isLeaveTableLoading, LeaveTableError] = useFetching(
    async (tableId) => {
      setLeaveTableErrorsMessage("");
      const response = await CashTablesService.leaveTable(tableId);

      if (!response.data.success) {
        setLeaveTableErrorsMessage(response.data.error);
      }

      navigate("/cash-table");
    }
  );

  // Player action processing
  const onAction = (action: string) => {
    fetchAction(tableId, action, betAmount);
  };

  // Update bet amount
  const handleChange = (value: number | string) => {
    let val = Number(value);
    if (val < minBet) val = minBet;
    if (val > maxBet) val = maxBet;
    setBetAmount(val);
  };

  // Setting the procent rate
  const handlePercent = (percent: number) => {
    const val = Math.floor((maxBet * percent) / 100);
    setBetAmount(val);
  };

  const minBet = data.betRange?.min || 0;
  const maxBet = data.betRange?.max || 0;

  const handleMessage = useCallback((event: MessageEvent) => {
    const newData: TableData = JSON.parse(event.data);

    // Debugging incoming data
    // console.log("newData", newData);

    setData((prev) => {
      // Merge previous data with new data
      const updated = { ...prev, ...newData };

      if (!initialDataLoaded.current) {
        initialDataLoaded.current = true;
        setIsLoadingInitialData(false);
      }

      // Update banks separately to trigger animations
      if (JSON.stringify(newData.banks) !== JSON.stringify(prev?.banks)) {
        setBanks(newData.banks);
      }
      return updated;
    });
  }, []);

  // SSE connection with token
  useEffect(() => {
    if (!tableId) {
      console.error("tableId is missing");
      return;
    }

    let eventSource: EventSource;
    let reconnectTimeout: NodeJS.Timeout;

    const connectSSE = async () => {
      console.log("Attempting to connect to SSE...");

      try {
        // Initializing connection
        eventSource = TableStateService.getTableStateSSE(tableId);

        // 2. Message handler
        eventSource.onmessage = handleMessage;

        // 3. Error handler with token refresh logic
        eventSource.onerror = async (error) => {
          console.error("SSE Error detected:", error);
          eventSource.close();
          clearTimeout(reconnectTimeout);

          try {
            // refresh token via Axios interceptor
            await UserService.getUser();

            console.log("Token refreshed via Axios. Reconnecting SSE shortly...");

            reconnectTimeout = setTimeout(connectSSE, 100); // Reconnect shortly after token refresh
          } catch (axiosError) {
            // if token refresh fails (e.g., invalid refresh_token)
            console.error("Failed to refresh token. User must log in.");
            contextLogout(); // delete auth context
            navigate("/login"); // Redirect to login
          }
        };
      } catch (error) {
        console.error("Initial SSE connection failed:", error);
        // Retry connection after 5 seconds
        reconnectTimeout = setTimeout(connectSSE, 5000);
      }
    };

    connectSSE(); // Start the connection

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [tableId, handleMessage]);

  // Bank animation
  useEffect(() => {
    const newAnimatedBanks = Object.keys(banks.items).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as { [key: string]: boolean });
    setAnimatedBanks(newAnimatedBanks);
    setIsRakeAnimated(true);

    const timeout = setTimeout(() => {
      setAnimatedBanks({});
      setIsRakeAnimated(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [banks.items, banks.rake]);

  // Timer update
  useEffect(() => {
    setTimeLeft(data.players[data.turnPlace]?.betExpTime || totalTime);
    setTotalTime(data.players[data.turnPlace]?.betExpTime || totalTime);
  }, [data.turnPlace, totalTime]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const percent = (timeLeft / totalTime) * 100;
  const barColor =
    percent <= 30
      ? "bg-red-500"
      : percent <= 60
      ? "bg-yellow-500"
      : "bg-green-500";

  // Winner processing
  useEffect(() => {
    if (!banks.items || Object.keys(banks.items).length === 0) return;
    const key = Object.keys(banks.items)[0];
    if (banks.items[key].winners.length === 0) return;

    setWinners(banks.items[key].winners.map(Number));
    setTimeout(() => setWinners([]), 5000);
  }, [banks.items, banks.rake]);

  // Memoization of table cards
  const tableCards = useMemo(() => {
    return data.cards.table.length > 0 ? (
      <div className="absolute left-1/2 top-[40%] -translate-x-1/2 flex gap-2 z-10">
        {data.cards.table.map((card, idx) => (
          <img
            key={idx}
            src={`${ASSETS.CARDS(card.suit, card.value)}`}
            alt={`Table Card ${idx + 1}`}
            className="w-12 h-20 rounded shadow-md my-animate-deal-card md:w-16 md:h-24"
            style={{ animationDelay: `${idx * 0.2}s` }}
          />
        ))}
      </div>
    ) : null;
  }, [data.cards.table]);

  // Memoization of players
  const playerElements = useMemo(() => {
    return Object.keys(data.players).map((place) => (
      <>
        {/* Player Chips */}
        <div
          key={place + "_chips"}
          className="absolute place-self-center z-30"
          style={{ gridArea: getGridArea(Number(place), "betChip") }}
        >
          {data.players[place].bet > 0 && (
            <div className="place-self-center ">
              <ChipsBlock />
              <span className="text-white text-sm font-bold text-center ml-3">
                {data.players[place].bet} {data.currency}
              </span>
            </div>
          )}
        </div>
        <div
          key={place + "_player"}
          className="absolute place-self-center z-20"
          style={{ gridArea: getGridArea(Number(place), "player") }}
        >
          <Player
            player={data.players[place]}
            myPlace={data.myPlace}
            cards={data.cards}
            currency={data.currency}
            isWinner={winners.includes(Number(place))}
            isTurn={data.turnPlace === Number(place)}
            barColor={barColor}
            percent={percent}
          />
        </div>
      </>
    ));
  }, [
    data.players,
    data.myPlace,
    data.cards,
    data.currency,
    winners,
    data.turnPlace,
    barColor,
    percent,
  ]);

  const openModalRebuy = () => {
    setStateModalRebuy(true);
  };

  const handleRebuy = (chips) => {
    fetchRebuy(data.id, chips);
  };

  const handleLeaveTable = () => {
    fetchLeaveTable(data.id);
  };

  const handleHistoryTable = () => {
    console.log("handleHistoryTable");
  };

  const errorMessages = [
    rebuyErrorsMessage,
    rebuyError?.message,
    actionError,
    LeaveTableError,
    LeaveTableErrorsMessage,
  ].filter(Boolean);

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
        onClose={() => setStateModalRebuy(false)}
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
          {tableCards}

          {/* Blind chips */}
          {data.dealerPlace > 0 && (
            <div
              className="place-self-center z-30"
              style={{ gridArea: getGridArea(data.dealerPlace, "blindChip") }}
            >
              <BlindChip type="dealer" />
            </div>
          )}
          {data.smallBlindPlace > 0 && (
            <div
              className="place-self-center z-30"
              style={{
                gridArea: getGridArea(data.smallBlindPlace, "blindChip"),
              }}
            >
              <BlindChip type="smallBlind" />
            </div>
          )}
          {data.bigBlindPlace > 0 && (
            <div
              className="place-self-center z-30"
              style={{ gridArea: getGridArea(data.bigBlindPlace, "blindChip") }}
            >
              <BlindChip type="bigBlind" />
            </div>
          )}

          {/* Players */}
          {playerElements}

          {/* Pots and rake */}
          {Object.keys(banks.items).length > 0 && (
            <div className="absolute place-self-center top-[32%] text-center z-10">
              {Object.entries(banks.items).map(([key, bank], index) => (
                <div
                  key={key}
                  className={`text-white text-lg font-semibold drop-shadow ${
                    animatedBanks[key] ? "my-animate-pulse" : ""
                  }`}
                >
                  {index === 0 ? "Pot" : `side Pot ${index}`}: {bank.sum}{" "}
                  {data.currency}
                </div>
              ))}
              <div
                className={`text-white text-base font-semibold drop-shadow ${
                  isRakeAnimated ? "my-animate-pulse" : ""
                }`}
              >
                Rake: {data.banks?.rake || 0} {data.currency}
              </div>
            </div>
          )}
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
