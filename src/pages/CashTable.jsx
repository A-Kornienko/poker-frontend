import React, { useState, useEffect } from "react";
import CashTableList from "../components/CashTableList";
import CashTableSidebar from "../components/CashTableSidebar";
import { useFetching } from "../hooks/useFetching";
import CashTablesService from "../api/CashTablesService";
import Loader from "../components/UI/Loader/Loader";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/UI/ErrorMessage";

const CashTable = () => {
  const navigate = useNavigate();

  const [tables, setTables] = useState({ items: [] });
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const [fetchTables, isTablesLoading, tableError] = useFetching(
    async (limit, page) => {
      const response = await CashTablesService.getTableList(limit, page);
      setTables({ ...response.data.data });
    }
  );

  useEffect(() => {
    fetchTables(limit, page);
  }, [page, limit]);

  const [playersInfo, setPlayersInfo] = useState([]);
  const [isTableInfo, setIsTableInfo] = useState(false);
  const [fetchPlayersInfo, isPlayersInfoLoading, PlayersInfoError] =
    useFetching(async (settingId) => {
      const response = await CashTablesService.getPlayersInfo(settingId);
      const { isAuthorized, ...players } = response.data.data || [];
      setPlayersInfo(Object.values(players));
    });

  const [currentSettingId, setCurrentSettingId] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const tableInfo = (settingId) => {
    clearSidebar();
    setIsTableInfo(true);
    setIsSettingDetails(false);
    fetchPlayersInfo(settingId);
    setCurrentSettingId(settingId);
    setSelectedRowId(settingId);
  };

  const [settingDetails, setSettingDetails] = useState({});
  const [isSettingDetails, setIsSettingDetails] = useState(false);

  const [fetchSettingDetails, isSettingDetailsLoading, SettingDetailsError] =
    useFetching(async (settingId) => {
      const response = await CashTablesService.getSettingDetails(settingId);
      setSettingDetails({ ...response.data.data });
    });

  const getSettingDetails = () => {
    setSettingDetails({});
    settingDetailsVisibility();

    if (!isSettingDetails) {
      fetchSettingDetails(currentSettingId);
    }
  };

  const [fetchTableConnect, isTableConnectLoading, TableConnectError] =
    useFetching(async (settingId) => {
      const response = await CashTablesService.connectToTable(settingId);

      if (response.data.success) {
        navigate("/poker-table/" + settingId);
      }
    });

  const joinToTable = (settingId) => {
    fetchTableConnect(settingId);
  };

  const settingDetailsVisibility = () => {
    isSettingDetails ? setIsSettingDetails(false) : setIsSettingDetails(true);
  };

  const clearSidebar = () => {
    setPlayersInfo([]);
    setSettingDetails({});
  };

  const closeSidebar = () => {
    clearSidebar();
    setIsTableInfo(false);
    setSelectedRowId(null);
  };

  const errors = [
    tableError,
    PlayersInfoError,
    SettingDetailsError,
    TableConnectError,
  ].filter(Boolean);

  return (
    <>
      {/* errors messages */}
      <div className="flex bg-zinc-900 h-vh-fullScreen w-screen relative overflow-hidden ">
        {errors.map((err, idx) => (
          <div key={idx} style={{ marginBottom: "0.75rem" }}>
            <ErrorMessage message={err} />
          </div>
        ))}

        {/* Loader */}
        {isTableConnectLoading && (
          <div className="absolute w-full h-vh-fullScreen bg-black opacity-50 ">
            <div className="absolute top-1/4 left-1/2">
              <Loader />
            </div>
          </div>
        )}

        <CashTableList
          tables={tables}
          isTablesLoading={isTablesLoading}
          selectedRowId={selectedRowId}
          tableInfo={tableInfo}
          joinToTable={joinToTable}
          isTableInfo={isTableInfo}
        />

        <CashTableSidebar
          isTableInfo={isTableInfo}
          playersInfo={playersInfo}
          isPlayersInfoLoading={isPlayersInfoLoading}
          getSettingDetails={getSettingDetails}
          isSettingDetails={isSettingDetails}
          isSettingDetailsLoading={isSettingDetailsLoading}
          settingDetails={settingDetails}
          closeSidebar={closeSidebar}
        />
      </div>
    </>
  );
};

export default CashTable;
