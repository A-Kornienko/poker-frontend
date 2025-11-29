import React, { useState, useEffect } from "react";
import CashTableList from "../components/CashTableList";
import CashTableSidebar from "../components/CashTableSidebar";
import { useFetching } from "../hooks/useFetching";
import CashTablesService from "../api/CashTablesService";
import Loader from "../components/UI/Loader/Loader";
import { useNavigate, useSearchParams } from "react-router-dom";
import ErrorMessage from "../components/UI/ErrorMessage";

const CashTable = () => {
  const navigate = useNavigate();

  const [tables, setTables] = useState({ items: [] });
  const [searchParams, setSearchParams] = useSearchParams();
  const limit = parseInt(searchParams.get("limit")) || 10;
  const page = parseInt(searchParams.get("page")) || 1;
  const[serverErrorsMessage, setServerErrorsMessage] = useState('')

  const [fetchTables, isTablesLoading, tableError] = useFetching(
    async (limit, page) => {
      const response = await CashTablesService.getTableList(limit, page);
      setTables({ ...response.data.data });
    }
  );

  useEffect(() => {
    fetchTables(limit, page);
  }, [page, limit]);

  // use for future pagination component
  // page change
  const setPageHandler = (newPage) => {
    setSearchParams({ page: newPage, limit });
  };

  const [playersInfo, setPlayersInfo] = useState([]);
  const [isTableInfo, setIsTableInfo] = useState(false);
  const [fetchPlayersInfo, isPlayersInfoLoading, playersInfoError] =
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

  const [fetchSettingDetails, isSettingDetailsLoading, settingDetailsError] =
    useFetching(async (settingId) => {
      const response = await CashTablesService.getSettingDetails(settingId);
      setSettingDetails({ ...response.data.data });
    });

  const getSettingDetails = () => {
    setSettingDetails({});

    setIsSettingDetails((prev) => {
      const newVisibility = !prev;
      if (newVisibility) {
        fetchSettingDetails(currentSettingId);
      }
      return newVisibility;
    });
  };

  const [fetchTableConnect, isTableConnectLoading, tableConnectError] =
    useFetching(async (settingId) => {

        setServerErrorsMessage('')
        const response = await CashTablesService.connectToTable(settingId);

        if (response.data.success) {
          navigate("/poker-table/" + settingId);
        }

        setServerErrorsMessage(response.data.error)
    });

  const joinToTable = (settingId) => {
    fetchTableConnect(settingId);
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

  const errorMessages  = [
    tableError?.message, 
    playersInfoError?.message, 
    settingDetailsError?.message, 
    tableConnectError?.message,
    serverErrorsMessage
  ].filter(Boolean);

  return (
    <>
      {/* errors messages */}
      <div className="flex bg-zinc-900 h-vh-fullScreen w-screen relative overflow-hidden ">
        {errorMessages.map((err, idx) => (
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
