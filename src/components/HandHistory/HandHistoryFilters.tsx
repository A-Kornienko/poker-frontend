interface HandHistoryFiltersProps {
  dateFrom: string;
  dateTo: string;
  isDateRangeInvalid: boolean;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export const HandHistoryFilters = ({
  dateFrom,
  dateTo,
  isDateRangeInvalid,
  onDateFromChange,
  onDateToChange,
  onApply,
  onReset,
}: HandHistoryFiltersProps) => (
  <div className="flex flex-wrap items-end gap-3 border-b border-zinc-800 px-6 py-4">
    <label className="flex flex-col gap-1 text-xs uppercase tracking-wider text-zinc-500">
      From
      <input
        type="datetime-local"
        value={dateFrom}
        max={dateTo || undefined}
        onChange={(event) => onDateFromChange(event.target.value)}
        className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm normal-case tracking-normal text-zinc-200 outline-none accent-amber-500 focus:border-amber-500 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:brightness-150 [&::-webkit-calendar-picker-indicator]:sepia [&::-webkit-calendar-picker-indicator]:saturate-[5] [&::-webkit-calendar-picker-indicator]:hue-rotate-[355deg]"
      />
    </label>
    <label className="flex flex-col gap-1 text-xs uppercase tracking-wider text-zinc-500">
      To
      <input
        type="datetime-local"
        value={dateTo}
        min={dateFrom || undefined}
        onChange={(event) => onDateToChange(event.target.value)}
        className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm normal-case tracking-normal text-zinc-200 outline-none accent-amber-500 focus:border-amber-500 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:brightness-150 [&::-webkit-calendar-picker-indicator]:sepia [&::-webkit-calendar-picker-indicator]:saturate-[5] [&::-webkit-calendar-picker-indicator]:hue-rotate-[355deg]"
      />
    </label>
    <button
      type="button"
      onClick={onApply}
      disabled={isDateRangeInvalid}
      className="rounded-md bg-amber-500 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Apply
    </button>
    <button
      type="button"
      onClick={onReset}
      className="rounded-md border border-zinc-700 px-5 py-2 text-sm font-semibold text-zinc-300 transition hover:border-amber-500 hover:text-amber-300"
    >
      Reset
    </button>
    {isDateRangeInvalid && (
      <p className="basis-full text-sm text-red-400">
        The start date must be earlier than the end date.
      </p>
    )}
  </div>
);
