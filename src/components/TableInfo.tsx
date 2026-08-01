import { useTableState } from "../store/selectors/selectTableState";

/**
 * TableInfo displays table metadata (name, blinds, players, etc.)
 * @returns {JSX.Element} Table information
 */
const TableInfo = () => {
  const data = useTableState();
  return (
  <div className="absolute top-4 left-4 text-white font-semibold drop-shadow text-sm md:text-base">
    <div>
      {data.name} | {data.rule} | Players: {data.countPlayers}/
      {data.limitPlayers}
    </div>
    <div>
      Blinds: {data.smallBlind}/{data.bigBlind} | Buy-in: {data.buyIn}
    </div>
    <div>
      Dealer: {data.dealerPlace} | SB: {data.smallBlindPlace} | BB:{" "}
      {data.bigBlindPlace}
    </div>
    <div>
      Turn: {data.turnPlace} | Last Word: {data.lastWordPlace} | My Position:{" "}
      {data.myPlace}
    </div>
    <div>
      Current Bet: {data.maxBet} | Bet Range: {data.betRange?.min} - {" "}
      {data.betRange?.max}
    </div>
    <div>
      Rank: {data.myPrize?.rank} | My Prize: {data.myPrize?.sum}
    </div>
    <div>
      State: {data.state} | Round: {data.round}
    </div>
  </div>
  )
};

export default TableInfo;
