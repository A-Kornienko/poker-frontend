import type { FC, FormEventHandler } from "react";
import type {
  MacroStreet,
  PlayerSettingOption,
  PlayerSettingsResponse,
} from "../../types/playerSettings";

const sectionClassName =
  "rounded-2xl border border-white/10 bg-zinc-900/75 p-5 shadow-xl shadow-black/10 sm:p-7";
const inputClassName =
  "w-full rounded-lg border border-white/10 bg-[#172321] px-3 py-2.5 text-sm text-gray-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";
const macroOptions: Record<MacroStreet, readonly number[]> = {
  preflop: [2, 4, 6, 8, 10],
  postflop: [10, 20, 30, 40, 50, 60, 70, 80, 90],
};

const formatMacroValue = (street: MacroStreet, value: number): string =>
  street === "preflop" ? `${value} BB` : `${value}%`;

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

interface TableGameplaySettingsProps {
  data: PlayerSettingsResponse;
  isSaving: boolean;
  saveError: unknown;
  successMessage: string;
  onStackViewToggle: () => void;
  onCardSqueezeToggle: () => void;
  onStackValueChange: (selectedValue: string) => void;
  onMacroChange: (street: MacroStreet, button: string, value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

const TableGameplaySettings: FC<TableGameplaySettingsProps> = ({
  data,
  isSaving,
  saveError,
  successMessage,
  onStackViewToggle,
  onCardSqueezeToggle,
  onStackValueChange,
  onMacroChange,
  onSubmit,
}) => {
  const renderToggle = (
    label: string,
    description: string,
    checked: boolean,
    onChange: () => void,
  ) => (
    <div className="flex items-center justify-between gap-5 py-4">
      <div>
        <h3 className="text-sm font-medium text-gray-100">{label}</h3>
        <p className="mt-1 text-sm leading-6 text-gray-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
          checked ? "bg-emerald-500" : "bg-zinc-600"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );

  const stackValueOptions = (current: PlayerSettingOption) => {
    const options = Object.entries(data.stackViewCurrencyOptions).map(
      ([value, name]) => ({ name, value }),
    );
    return options.some((option) => option.value === current.value)
      ? options
      : [current, ...options];
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <section className={sectionClassName} aria-labelledby="table-display-title">
        <div className="mb-2">
          <h2 id="table-display-title" className="text-lg font-semibold text-white">
            Table display
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Choose how information appears while you play.
          </p>
        </div>

        <div className="divide-y divide-white/5">
          {renderToggle(
            "Stack view",
            "Show your stack using your preferred currency and value format.",
            data.stackView.active,
            onStackViewToggle,
          )}
        </div>

        <div className="border-t border-white/5 pt-5">
          <label className="block max-w-sm">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-400">
              Display stack in the table as
            </span>
            <select
              className={inputClassName}
              value={data.stackView.value.value}
              onChange={(event) => onStackValueChange(event.target.value)}
              disabled={!Object.keys(data.stackViewCurrencyOptions).length}
            >
              {stackValueOptions(data.stackView.value).map((option) => (
                <option key={`${option.name}-${option.value}`} value={option.value}>
                  {option.name} ({option.value})
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 border-t border-white/5">
          {renderToggle(
            "Card squeeze",
            "Enable the compact card interaction on the table.",
            data.cardSqueeze,
            onCardSqueezeToggle,
          )}
        </div>
      </section>

      <section className={sectionClassName} aria-labelledby="macros-title">
        <div className="mb-5">
          <h2 id="macros-title" className="text-lg font-semibold text-white">
            Button macros
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Set the amount for each quick-action button.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {(["preflop", "postflop"] as const).map((street) => (
            <div key={street}>
              <h3 className="mb-3 text-sm font-medium capitalize text-emerald-300">
                {street}
              </h3>
              <div className="space-y-3">
                {Object.entries(data.buttonMacros[street]).map(([button, value]) => {
                  const options = macroOptions[street];
                  const hasCurrentOption = options.includes(value);

                  return (
                    <label
                      key={`${street}-${button}`}
                      className="flex items-center justify-between gap-4 rounded-lg border border-white/5 bg-[#172321]/70 px-3 py-2.5"
                    >
                      <span className="text-sm text-gray-300">Button {button}</span>
                      <div className="flex max-w-44 items-center gap-2">
                        <select
                          className={`${inputClassName} py-2 text-right`}
                          value={value}
                          onChange={(event) => onMacroChange(street, button, event.target.value)}
                          aria-label={`${street} button ${button} amount`}
                        >
                          {!hasCurrentOption && (
                            <option value={value} disabled>
                              {formatMacroValue(street, value)} (current)
                            </option>
                          )}
                          {options.map((option) => (
                            <option key={option} value={option}>
                              {formatMacroValue(street, option)}
                            </option>
                          ))}
                        </select>
                        <span className="shrink-0 text-sm text-gray-400">
                          {street === "preflop" ? "BB" : "%"}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col-reverse items-stretch justify-between gap-4 pt-1 sm:flex-row sm:items-center">
        <div aria-live="polite" className="min-h-5 text-sm">
          {saveError ? (
            <span className="text-red-300">{getErrorMessage(saveError)}</span>
          ) : null}
          {successMessage && <span className="text-emerald-300">{successMessage}</span>}
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-[#10201b] transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-[#101a19] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
};

export default TableGameplaySettings;
