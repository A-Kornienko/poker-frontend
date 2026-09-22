import { useCallback, useEffect, useRef, useState } from "react";
import ChatService, { ChatMessage } from "../api/ChatService";

const HISTORY_LIMIT = 30;
const RECONNECT_DELAY = 3000;

interface ParsedSsePayload {
  messages: ChatMessage[];
  pagination?: { page: number; pages: number };
}

const normalizeMessages = (
  items: ChatMessage[] | Record<string, ChatMessage> | undefined,
): ChatMessage[] => {
  if (!items) return [];
  return Array.isArray(items) ? items : Object.values(items);
};

const parseSseMessages = (data: string): ParsedSsePayload => {
  try {
    const parsed: unknown = JSON.parse(data);
    if (typeof parsed !== "object" || parsed === null) {
      return { messages: [] };
    }

    const payload = parsed as Partial<ChatMessage> & {
      item?: ChatMessage;
      items?: ChatMessage[] | Record<string, ChatMessage>;
      pagination?: { page?: number; pages?: number };
    };
    
    const items = payload.items
      ? normalizeMessages(payload.items)
      : [payload.item ?? payload];
      
    const messages = items.filter(
      (message): message is ChatMessage =>
        message.id !== undefined && typeof message.message === "string",
    );

    return {
      messages,
      pagination:
        payload.pagination?.page !== undefined && payload.pagination.pages !== undefined
          ? {
              page: payload.pagination.page,
              pages: payload.pagination.pages,
            }
          : undefined,
    };
  } catch {
    return { messages: [] };
  }
};

export const useTableChat = (tableId: number, enabled: boolean) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const currentPageRef = useRef(1);
  const totalPagesRef = useRef(1);
  const isLoadingHistoryRef = useRef(false);

  const loadHistory = useCallback(async () => {
    if (
      isLoadingHistoryRef.current ||
      currentPageRef.current >= totalPagesRef.current
    ) {
      return;
    }

    isLoadingHistoryRef.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const nextPage = currentPageRef.current + 1;
      const response = await ChatService.getHistory(tableId, nextPage, HISTORY_LIMIT);
      const historyMessages = normalizeMessages(response.items);
      setMessages((currentMessages) => {
        const messagesById = new Map<number | string, ChatMessage>();
        [...historyMessages, ...currentMessages].forEach((message) => {
          messagesById.set(message.id, message);
        });
        return Array.from(messagesById.values());
      });

      currentPageRef.current = response.pagination.page;
      totalPagesRef.current = response.pagination.pages;
      setHasMoreHistory(currentPageRef.current < totalPagesRef.current);
    } catch {
      setError("Не вдалося завантажити історію чату");
    } finally {
      setIsLoading(false);
      isLoadingHistoryRef.current = false;
    }
  }, [tableId]);

  useEffect(() => {
    if (!enabled) {
      setMessages([]);
      setError(null);
      setHasLoadedHistory(false);
      setHasMoreHistory(true);
      currentPageRef.current = 1;
      totalPagesRef.current = 1;
      return;
    }

    let reconnectTimeout: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;

    const closeConnection = () => {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };

    const connect = () => {
      if (disposed) return;

      try {
        const eventSource = ChatService.getMessagesSSE(tableId);
        
        eventSourceRef.current = eventSource;
        eventSource.onmessage = (event) => {
          const payload = parseSseMessages(event.data);
          const incomingMessages = payload.messages;
          if (incomingMessages.length === 0) return;

          if (payload.pagination) {
            totalPagesRef.current = payload.pagination.pages;
            setHasMoreHistory(currentPageRef.current < totalPagesRef.current);
          }

          setIsLoading(false);
          setHasLoadedHistory(true);

          setMessages((currentMessages) => {
            const messagesById = new Map(
              currentMessages.map((message) => [message.id, message]),
            );

            incomingMessages.forEach((message) => {
              messagesById.set(message.id, message);
            });

            return Array.from(messagesById.values());
          });
        };
        eventSource.onerror = () => {
          closeConnection();
          if (!disposed) {
            reconnectTimeout = setTimeout(connect, RECONNECT_DELAY);
          }
        };
      } catch {
        reconnectTimeout = setTimeout(connect, RECONNECT_DELAY);
      }
    };

    connect();

    return () => {
      disposed = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      closeConnection();
    };
  }, [enabled, tableId]);

  const sendMessage = useCallback(
    async (message: string) => {
      const trimmedMessage = message.trim();
      if (!trimmedMessage || isSending) return;

      setIsSending(true);
      setError(null);
      try {
        await ChatService.sendMessage(tableId, trimmedMessage);
      } catch {
        setError("I could not send the message. Please try again.");
      } finally {
        setIsSending(false);
      }
    },
    [isSending, tableId],
  );

  return {
    messages,
    isLoading,
    hasLoadedHistory,
    hasMoreHistory,
    loadHistory,
    isSending,
    error,
    sendMessage,
  };
};