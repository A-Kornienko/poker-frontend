import { useEffect, useRef } from "react";
import TableStateService from "../api/TableStateService";
import UserService from "../api/Auth/UserService";
import { TIMERS } from "../constants/pokerGameConstants";

interface UseTableSSEOptions {
  tableId: number;
  onMessage: (event: MessageEvent) => void;
  onAuthError: () => void;
}

export const useTableSSE = ({
  tableId,
  onMessage,
  onAuthError,
}: UseTableSSEOptions) => {
  const eventSourceRef = useRef<EventSource | null>(null);
  const onMessageRef = useRef(onMessage);
  const onAuthErrorRef = useRef(onAuthError);

  onMessageRef.current = onMessage;
  onAuthErrorRef.current = onAuthError;

  useEffect(() => {
    if (!tableId) {
      console.error("tableId is missing");
      return;
    }

    let reconnectTimeout: ReturnType<typeof setTimeout>;

    const closeSSE = () => {
      const es = eventSourceRef.current;
      if (!es) return;
      es.onmessage = null;
      es.onerror = null;
      es.close();
      eventSourceRef.current = null;
    };

    const connectSSE = async () => {
      closeSSE();

      console.log("Attempting to connect to SSE...");

      try {
        const eventSource = TableStateService.getTableStateSSE(tableId);
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => onMessageRef.current(event);

        eventSource.onerror = async (error) => {
          console.error("SSE Error detected:", error);
          closeSSE();
          clearTimeout(reconnectTimeout);

          try {
            await UserService.getUser();
            console.log("Token refreshed via Axios. Reconnecting SSE shortly...");
            reconnectTimeout = setTimeout(connectSSE, TIMERS.RECONNECT_DELAY);
          } catch {
            console.error("Failed to refresh token. User must log in.");
            onAuthErrorRef.current();
          }
        };
      } catch (error) {
        console.error("Initial SSE connection failed:", error);
        reconnectTimeout = setTimeout(connectSSE, TIMERS.INITIAL_RECONNECT);
      }
    };

    connectSSE();

    return () => {
      clearTimeout(reconnectTimeout);
      closeSSE();
    };
  }, [tableId]);
};
