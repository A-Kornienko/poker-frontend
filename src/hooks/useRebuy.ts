import { useCallback, useState } from "react";

import RebuyService from "../api/RebuyService";
import { useFetching } from "../hooks/useFetching";

export const useRebuy = (tableId: number) => {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [fetchRebuy, isLoading, error] = useFetching(
    async (tableId: number, chips: number) => {
      setErrorMessage("");

      const response = await RebuyService.rebuy(tableId, chips);

      if (response.data.success) {
        setIsOpen(false);
        return;
      }

      setErrorMessage(response.data.error);
    },
  );

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const rebuy = useCallback(
    (chips: number) => {
      fetchRebuy(tableId, chips);
    },
    [tableId, fetchRebuy],
  );

  return {
    isOpen,
    openModal,
    closeModal,
    rebuy,
    isLoading,
    error,
    errorMessage,
  };
}