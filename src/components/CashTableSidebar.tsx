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
  <div
    className={
      "absolute top-0 right-0 rounded border-8 border-black border-solid w-1/3 h-full ml-1 transition-all duration-500 ease-in-out bg-zinc-900 " +
      (isTableInfo
        ? "flex flex-col translate-x-0 opacity-100"
        : "translate-x-10 opacity-0 pointer-events-none")
    }
    style={{ zIndex: 10 }}
  >
    <table className="table-auto w-full ">
      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="font-medium p-2 border-r-4 border-gray-300 border-solid">
            Player
          </th>
          <th className="font-medium p-2 border-r-4 border-gray-300 border-solid">
            №
          </th>
          <th className="font-medium p-2 border-r-4 border-gray-300 border-solid last:border-r-0">
            Chips
          </th>
        </tr>
      </thead>
      <tbody className="bg-zinc-600 text-gray-300 text-center p-4">
        {!isPlayersInfoLoading && playersInfo.length === 0 ? (
          <tr>
            <td colSpan={5}>
              <div className="bg-zinc-700 text-red-400 rounded p-4 m-4 shadow font-semibold">
                No info about players available
              </div>
            </td>
          </tr>
        ) : (
          playersInfo.map((player) => (
            <tr
              key={player.login}
              className="border-b-4 border-black border-solid hover:bg-red-900"
            >
              <td>{player.login}</td>
              <td>{player.tableId}</td>
              <td>${player.stack}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    {isPlayersInfoLoading && (
      <div className="flex justify-center p-5">
        <Loader />
      </div>
    )}
    <div
      onClick={() => getSettingDetails()}
      className="mt-1 flex justify-center items-center cursor-pointer hover:bg-sky-500"
    >
      <p className="px-6 py-2 text-white">more information about the game</p>
      {isSettingDetails ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          style={{ width: "2rem", height: "2rem", fill: "#fff" }}
        >
          <path d="M297.4 169.4C309.9 156.9 330.2 156.9 342.7 169.4L534.7 361.4C547.2 373.9 547.2 394.2 534.7 406.7C522.2 419.2 501.9 419.2 489.4 406.7L320 237.3L150.6 406.6C138.1 419.1 117.8 419.1 105.3 406.6C92.8 394.1 92.8 373.8 105.3 361.3L297.3 169.3z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          style={{ width: "2rem", height: "2rem", fill: "#fff" }}
        >
          <path d="M297.4 470.6C309.9 483.1 330.2 483.1 342.7 470.6L534.7 278.6C547.2 266.1 547.2 245.8 534.7 233.3C522.2 220.8 501.9 220.8 489.4 233.3L320 402.7L150.6 233.4C138.1 220.9 117.8 220.9 105.3 233.4C92.8 245.9 92.8 266.2 105.3 278.7L297.3 470.7z" />
        </svg>
      )}
    </div>

    {isSettingDetailsLoading && (
      <div className="flex justify-center p-5">
        <Loader />
      </div>
    )}
    <div
      style={{
        display: !isSettingDetailsLoading && isSettingDetails ? null : "none",
      }}
      className="myScrollbar text-white flex-1 overflow-y-auto"
    >
      {/* Checking the availability of data and loader */}
      {isSettingDetailsLoading ? (
        <div className="flex justify-center p-5">
          <Loader />
        </div>
      ) : Object.keys(settingDetails).length > 0 ? (
        <>
          <div className="flex justify-between  p-2 m-2 bg-zinc-600 rounded">
            <p>Name</p>
            <p className="text-gray-300">{settingDetails.name}</p>
          </div>
          <div className="flex justify-between  p-2 m-2 bg-zinc-600 rounded">
            <p>Type</p>
            <p className="text-gray-300">{settingDetails.type}</p>
          </div>
          <div className="flex justify-between  p-2 m-2 bg-zinc-600 rounded">
            <p>Rules</p>
            <p className="text-gray-300">{settingDetails.rule}</p>
          </div>
          <div className="flex justify-between  p-2 m-2 bg-zinc-600 rounded">
            <p>Buy-in</p>
            <p className="text-gray-300">{settingDetails.buyIn} $</p>
          </div>
          <div className="flex justify-between  p-2 m-2 bg-zinc-600 rounded">
            <p>Blinds</p>
            <p className="text-gray-300">
              {settingDetails.smallBlind}$ / {settingDetails.bigBlind}$
            </p>
          </div>
          <div className="flex justify-between  p-2 m-2 bg-zinc-600 rounded">
            <p>Time to move</p>
            <p className="text-gray-300">{settingDetails.turnTime} sec</p>
          </div>
          <div className="flex justify-between  p-2 m-2 bg-zinc-600 rounded">
            <p>Time Bank</p>
            <p className="text-gray-300">
              {settingDetails?.timeBank?.timeLimit} sec
            </p>
          </div>
          <div className="flex justify-between  p-2 m-2 bg-zinc-600 rounded">
            <p>Minimum number of players at the table</p>
            <p className="text-gray-300">2</p>
          </div>
          <div className="flex justify-between  p-2 m-2 bg-zinc-600 rounded">
            <p>Currency</p>
            <p className="text-gray-300">{settingDetails.currency}</p>
          </div>
          <div className="flex justify-between  p-2 m-2 bg-zinc-600 rounded">
            <p>Rake</p>
            <p className="text-gray-300">{settingDetails.rake}%</p>
          </div>
          <div className="flex justify-between  p-2 m-2 bg-zinc-600 rounded">
            <p>Rake cap</p>
            <p className="text-gray-300">{settingDetails.rakeCap}$</p>
          </div>
          <div className="flex flex-col  p-2 m-2 bg-zinc-600 rounded">
            <p>Hold'em Rules</p>
            <p className="text-gray-300">
              Texas Hold'em is the most popular version of poker in the world. A
              standard deck of 52 cards is used for the game. Each player
              receives two dark cards ("pocket cards"). Then, during four rounds
              of trading, five community cards are laid out on the table. With
              the help of common and closed cards, the player must collect the
              best combination of five cards.
            </p>
          </div>
        </>
      ) : (
        <div className="bg-zinc-700 text-gray-300 rounded p-4 m-4 shadow font-semibold text-center">
          Table data unavailable
        </div>
      )}
    </div>

    <div className="absolute h-24 w-10 inset-1/3 left-0 opacity-20 hover:opacity-100">
      <button
        onClick={() => closeSidebar()}
        className="w-full h-full bg-gray-300 rounded-r-lg"
      >
        <svg
          viewBox="0 0 24 24"
          role="presentation"
          style={{ width: "2.5rem", height: "3rem" }}
        >
          <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
        </svg>
      </button>
    </div>
  </div>
);

export default CashTableSidebar;
