import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { useTableSSE } from "./useTableSSE";

import { updateTableState } from "../store/tableStateStore";
import type { TableData } from "../types/poker";

type Props = {
  tableId: number;
};

export const useTableConnection = ({ tableId }: Props) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const initialDataLoaded = useRef(false);

  const handleMessage = useCallback((event: MessageEvent) => {
    const newData: TableData = JSON.parse(event.data);

    updateTableState(newData);

    if (!initialDataLoaded.current) {
      initialDataLoaded.current = true;
      setIsInitialLoading(false);
    }
  }, []);

  const handleAuthError = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  useTableSSE({
    tableId,
    onMessage: handleMessage,
    onAuthError: handleAuthError,
  });

  return {
    isInitialLoading,
  };
}
