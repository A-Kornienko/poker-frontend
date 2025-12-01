
import React, { useState } from "react"; // <-- Виправлення 1
import MyButton from "../components/UI/MyButton";
import Loader from "../components/UI/Loader/Loader";
import JoinTableModal from "../components/Modals/JoinTableModal";

const CashTableList = ({
  tables,
  isTablesLoading,
  selectedRowId,
  tableInfo,
  joinToTable,
  isTableInfo,
}) => {

  const [modalOpen, setModalOpen] = useState(false);
  const [settingId, setSettingId] = useState(null);

  const openJoinModal = (settingId) => {
    setSettingId(settingId);
    setModalOpen(true);
  };

  const handleJoin = (stack) => {
    if (settingId !== null) { 
      joinToTable(settingId, stack); 
      setModalOpen(false);
    }
  };

  return (
    <>
      <div
        className={
          "rounded border-8 border-solid border-black h-full transition-all duration-500 ease-in-out " +
          (isTableInfo ? "w-2/3" : "w-full")
        }
      >
        {isTablesLoading && (
          <div className="absolute left-1/2 top-1/3">
            <Loader />
          </div>
        )}
        <table className="table-auto w-full">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="font-medium p-2 border-r-4 border-gray-300 border-solid">
                Buy-in
              </th>
              <th className="font-medium p-2 border-r-4 border-gray-300 border-solid">
                Blinds
              </th>
              <th className="font-medium p-2 border-r-4 border-gray-300 border-solid">
                Tables
              </th>
              <th className="font-medium p-2 border-r-4 border-gray-300 border-solid">
                Players
              </th>
              <th className="font-medium p-2 border-r-4 border-gray-300 border-solid last:border-r-0">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-zinc-600 text-gray-300 text-center p-4">
            {!isTablesLoading && tables.items.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="bg-zinc-700 text-red-400 rounded p-4 m-4 shadow font-semibold">
                    No tables available
                  </div>
                </td>
              </tr>
            ) : (
              tables.items.map((item) => (
                <tr
                  className={
                    "border-b-4 border-black border-solid hover:bg-red-900 " +
                    (selectedRowId === item.settingId ? "bg-red-900" : "")
                  }
                  key={item.settingId}
                >
                  <td>${item.buyIn}</td>
                  <td>
                    ${item.smallBlind}/${item.bigBlind}
                  </td>
                  <td>
                    <div className="flex justify-center items-center p-1">
                      <div className="playerMaxCount">{item.limitPlayers}</div>
                      <div className="rounded-full border-2 border-black bg-zinc-800 h-8 w-12 flex justify-center items-center">
                        {item.countTables}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-center items-center p-1">
                      <svg
                        viewBox="0 0 24 24"
                        role="presentation"
                        style={{ width: "1.5rem", height: "1.5rem" }}
                      >
                        <path
                          d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"
                          style={{ fill: "#22c55e" }}
                        ></path>
                      </svg>
                      <span className="p-2 text-green-500">
                        {item.countPlayers}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex">
                      <MyButton onClick={() => tableInfo(item.settingId)}>
                        <div className="flex justify-center">
                          <svg
                            viewBox="0 0 24 24"
                            role="presentation"
                            style={{ width: "1.5rem", height: "1.5rem" }}
                          >
                            <path
                              d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                              style={{ fill: "#0369a1" }}
                            ></path>
                          </svg>
                          <p className="text-sky-500 ">Info</p>
                        </div>
                      </MyButton>
                      <MyButton onClick={() => openJoinModal(item.settingId)}>
                        <p className="text-green-500">Join</p>
                      </MyButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
