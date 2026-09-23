export const formatAmount = (amount: number): string => {
  const numericAmount = Number(amount);

  return Number.isInteger(numericAmount)
    ? numericAmount.toString()
    : numericAmount.toFixed(2);
};

export const shortSession = (session: string): string =>
  `${session.slice(0, 8)}...${session.slice(-6)}`;

export const getDateTimeValue = (value: string): number | null => {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/,
  );

  if (!match) return null;

  const [, year, month, day, hours, minutes, seconds = "0"] = match;
  const localDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    Number(seconds),
  );
  const timestamp = localDate.getTime();

  return Number.isNaN(timestamp) ? null : timestamp;
};

export const formatDateForApi = (value: string): string | undefined => {
  const timestamp = getDateTimeValue(value);

  return timestamp === null ? undefined : new Date(timestamp).toISOString();
};

export const formatDateTime = (value: string | number): string => {
  const numericValue = Number(value);
  const date =
    typeof value === "number" || !Number.isNaN(numericValue)
      ? new Date(
          numericValue < 1_000_000_000_000
            ? numericValue * 1000
            : numericValue,
        )
      : new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown time";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};
