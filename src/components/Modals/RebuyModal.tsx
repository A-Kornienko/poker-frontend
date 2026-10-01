import React from "react";
import MyModal from "../UI/MyModal";

interface RebuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRebuy: (chips: number) => void;
  initialStack?: number;
  isLoading: boolean;
}

const RebuyModal: React.FC<RebuyModalProps> = ({
  isOpen,
  onClose,
  onRebuy,
  initialStack = 50,
  isLoading,
}) => {
  const [chips, setСhips] = React.useState(initialStack);
  const chipPresets = [25, 50, 75, 100];

  React.useEffect(() => {
    if (isOpen) setСhips(initialStack);
  }, [isOpen, initialStack]);

  const handleRebuy = () => {
    onRebuy(chips);
  };

  return (
    <MyModal
      isOpen={isOpen}
      onClose={onClose}
      title="Rebuy Chips"
      className="stack-modal max-w-md !rounded-2xl !border !border-amber-500/20 !bg-zinc-950"
    >
      <div className="space-y-7">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
            Rebuy amount
          </p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-amber-300">
            ${chips}
          </p>
        </div>

        <div className="space-y-3">
          <label htmlFor="rebuy-range" className="sr-only">
            Choose rebuy amount
          </label>
          <input
            id="rebuy-range"
            type="range"
            min="10"
            max="100"
            step="5"
            value={chips}
            onChange={(event) => setСhips(Number(event.target.value))}
            aria-valuetext={`$${chips}`}
            disabled={isLoading}
            className="stack-range-slider w-full disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${
                ((chips - 10) / 90) * 100
              }%, #3f3f46 ${((chips - 10) / 90) * 100}%, #3f3f46 100%)`,
            }}
          />

          <div className="flex justify-between text-xs text-zinc-500">
            <span>$10</span>
            <span>$100</span>
          </div>
        </div>

        <div
          className="grid grid-cols-4 gap-2"
          role="group"
          aria-label="Preset rebuy amounts"
        >
          {chipPresets.map((amount) => (
            <button
              key={amount}
              type="button"
              aria-pressed={chips === amount}
              onClick={() => setСhips(amount)}
              disabled={isLoading}
              className={`rounded-lg border px-2 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-50 ${
                chips === amount
                  ? "border-amber-400/60 bg-amber-400/10 text-amber-300"
                  : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-amber-400/40 hover:text-zinc-100"
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={handleRebuy}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-amber-400 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Rebuying..." : "Rebuy"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-white/10 px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </MyModal>
  );
};

export default RebuyModal;