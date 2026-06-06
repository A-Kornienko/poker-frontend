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
      {data.name} | Правило: {data.rule} | Гравці: {data.countPlayers}/
      {data.limitPlayers}
    </div>
    <div>
      Блайнди: {data.smallBlind}/{data.bigBlind} | Бай-ін: {data.buyIn}
    </div>
    <div>
      Дилер: {data.dealerPlace} | МБ: {data.smallBlindPlace} | ВБ:{" "}
      {data.bigBlindPlace}
    </div>
    <div>
      Хід: {data.turnPlace} | Останнє слово: {data.lastWordPlace} | Моя позиція:{" "}
      {data.myPlace}
    </div>
    <div>
      Макс. ставка: {data.maxBet} | Діапазон ставок: {data.betRange?.min} -{" "}
      {data.betRange?.max}
    </div>
    <div>
      Мій ранг: {data.myPrize?.rank} | Мій виграш: {data.myPrize?.sum}
    </div>
    <div>
      Стан: {data.state} | Раунд: {data.round}
    </div>
  </div>
  )
};

export default TableInfo;
