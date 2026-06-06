import { useCallback, useState } from "react";

import CashTablesService from "../api/CashTablesService";
import { useFetching } from "../hooks/useFetching";

export const useLeaveTable =(tableId: number, onSuccess?: () => void) => {

  const [errorMessage, setErrorMessage] = useState("");

  const [fetchLeaveTable, isLoading, error] = useFetching(
    async (tableId: number) => {
      setErrorMessage("");

      const response = await CashTablesService.leaveTable(tableId);

      if (!response.data.success) {
        setErrorMessage(response.data.error);
        return;
      }

      // navigate("/cash-table")
      onSuccess?.();
    },
  );

  const leaveTable = useCallback(() => {
    fetchLeaveTable(tableId);
  }, [tableId, fetchLeaveTable]);

  return {
    leaveTable,
    isLoading,
    error,
    errorMessage,
  };
}
