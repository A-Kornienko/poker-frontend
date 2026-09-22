import { FormEvent, useEffect, useRef, useState } from "react";
import { ChatMessage } from "../api/ChatService";

interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  hasLoadedHistory: boolean;
  hasMoreHistory: boolean;
  isSending: boolean;
  error: string | null;
  onSend: (message: string) => Promise<void>;
  onLoadOlder: () => Promise<void>;
  onClose: () => void;
}

const ChatPanel = ({
  messages,
  isLoading,
  hasLoadedHistory,
  hasMoreHistory,
  isSending,
  error,
  onSend,
  onLoadOlder,
  onClose,
}: ChatPanelProps) => {
  const [draft, setDraft] = useState("");
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const preserveScrollRef = useRef<{ height: number; top: number } | null>(null);
  const stickToBottomRef = useRef(true);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    if (preserveScrollRef.current) {
      const previous = preserveScrollRef.current;
      container.scrollTop = container.scrollHeight - previous.height + previous.top;
      preserveScrollRef.current = null;
      return;
    }

    if (stickToBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const isHistoryLoading = isLoading || !hasLoadedHistory;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.trim()) return;
    await onSend(draft);
    setDraft("");
  };

  const handleScroll = async () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    stickToBottomRef.current =
      container.scrollHeight - container.scrollTop - container.clientHeight < 40;

    if (container.scrollTop > 0 || !hasMoreHistory || isLoadingOlder || isLoading) {
      return;
    }

    preserveScrollRef.current = {
      height: container.scrollHeight,
      top: container.scrollTop,
    };
    setIsLoadingOlder(true);
    try {
      await onLoadOlder();
    } finally {
      setIsLoadingOlder(false);
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[min(360px,90vw)] flex-col border-r border-amber-400/20 bg-zinc-950/95 text-white shadow-2xl shadow-black/50 backdrop-blur-md">
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-400">
            Table chat
          </p>
          <h2 className="mt-1 text-lg font-semibold text-zinc-100">Players on the table</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-3 pb-1 text-2xl leading-none text-zinc-400 transition hover:bg-white/10 hover:text-white"
          aria-label="Close chat panel"
        >
          &times;
        </button>
      </header>

      <div
        ref={messagesContainerRef}
        onScroll={() => void handleScroll()}
        className="myScrollbar flex-1 space-y-3 overflow-y-auto px-4 py-5"
      >
        {isLoadingOlder && <p className="text-center text-xs text-zinc-500">Loading older messages...</p>}
        {isHistoryLoading && <p className="text-center text-sm text-zinc-500">Loading...</p>}
        {!isHistoryLoading && messages.length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-500">No messages yet</p>
        )}
        {messages.map((chatMessage) => (
          <div
            key={chatMessage.id}
            className={`max-w-[88%] rounded-xl border px-3 py-2 ${
              chatMessage.isCurrentUser
                ? "ml-auto border-amber-400/30 bg-amber-400/10"
                : "border-white/10 bg-white/[0.04]"
            }`}
          >
            <p className="mb-1 text-xs font-medium text-amber-300">{chatMessage.user}</p>
            <p className="break-words text-sm leading-5 text-zinc-200">{chatMessage.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && <p className="border-t border-red-400/20 px-4 py-2 text-xs text-red-300">{error}</p>}

      <form onSubmit={handleSubmit} className="border-t border-white/10 bg-black/20 p-4">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 p-1 focus-within:border-amber-400/60">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write a message..."
            maxLength={500}
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600"
            aria-label="Message"
          />
          <button
            type="submit"
            disabled={isSending || !draft.trim()}
            className="rounded-lg bg-amber-400 px-3 py-2 text-sm font-bold text-zinc-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSending ? "..." : "Send"}
          </button>
        </div>
      </form>
    </aside>
  );
};

export default ChatPanel;