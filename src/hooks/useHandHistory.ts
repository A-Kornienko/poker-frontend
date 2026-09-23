import { useCallback, useEffect, useState } from "react";
import HandHistoryService, {
  HandHistoryFilters,
  HandHistoryPage,
} from "../api/HandHistoryService";
import { HandHistoryDetails } from "../types/handHistory";
import {
  formatDateForApi,
  getDateTimeValue,
} from "../components/HandHistory/formatters";

export const useHandHistory = (tableId: number) => {
  const [history, setHistory] = useState<HandHistoryPage | null>(null);
  const [openSession, setOpenSession] = useState<string | null>(null);
  const [details, setDetails] = useState<HandHistoryDetails | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activeDateFrom, setActiveDateFrom] = useState("");
  const [activeDateTo, setActiveDateTo] = useState("");
  const [error, setError] = useState<string | null>(null);

  const dateFromValue = getDateTimeValue(dateFrom);
  const dateToValue = getDateTimeValue(dateTo);
  const isDateRangeInvalid = Boolean(
    dateFromValue !== null &&
      dateToValue !== null &&
      dateFromValue > dateToValue,
  );
  const hasActiveDateFilter = Boolean(activeDateFrom || activeDateTo);

  const loadHistory = useCallback(
    async (page = 1, dateRange: HandHistoryFilters = {}) => {
      setIsLoading(page === 1);
      setIsPageLoading(page > 1);
      setError(null);
      setOpenSession(null);
      setDetails(null);

      try {
        setHistory(
          await HandHistoryService.getTableHistory(tableId, page, 20, dateRange),
        );
      } catch {
        setError("Unable to load hand history.");
      } finally {
        setIsLoading(false);
        setIsPageLoading(false);
      }
    },
    [tableId],
  );

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const handleSessionClick = async (session: string) => {
    if (openSession === session) {
      setOpenSession(null);
      setDetails(null);
      setIsDetailsLoading(false);
      return;
    }

    setOpenSession(session);
    setDetails(null);
    setIsDetailsLoading(true);
    setError(null);

    try {
      setDetails(await HandHistoryService.getDetails(session));
    } catch {
      setError("Unable to load hand details.");
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const applyDateFilter = () => {
    if (isDateRangeInvalid) return;

    const apiDateFrom = formatDateForApi(dateFrom);
    const apiDateTo = formatDateForApi(dateTo);

    setActiveDateFrom(apiDateFrom ?? "");
    setActiveDateTo(apiDateTo ?? "");
    void loadHistory(1, { dateFrom: apiDateFrom, dateTo: apiDateTo });
  };

  const resetDateFilter = () => {
    setDateFrom("");
    setDateTo("");
    setActiveDateFrom("");
    setActiveDateTo("");
    void loadHistory(1, { dateFrom: "", dateTo: "" });
  };

  const changePage = (page: number) => {
    if (!history || page < 1 || page > history.pagination.pages) return;

    void loadHistory(page, {
      dateFrom: activeDateFrom,
      dateTo: activeDateTo,
    });
  };

  return {
    history,
    openSession,
    details,
    isDetailsLoading,
    isLoading,
    isPageLoading,
    dateFrom,
    dateTo,
    error,
    isDateRangeInvalid,
    hasActiveDateFilter,
    setDateFrom,
    setDateTo,
    handleSessionClick,
    applyDateFilter,
    resetDateFilter,
    changePage,
  };
};
