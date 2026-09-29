import { useState } from "react";
import SettingsPlaceholder from "../components/Settings/SettingsPlaceholder";
import SettingsTabs, { type SettingsTab } from "../components/Settings/SettingsTabs";
import TableGameplaySettings from "../components/Settings/TableGameplaySettings";
import usePlayerSettings from "../hooks/usePlayerSettings";

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("gameplay");
  const {
    data,
    isLoading,
    settingsError,
    isSaving,
    saveError,
    successMessage,
    fetchSettings,
    handleStackViewToggle,
    handleCardSqueezeToggle,
    handleStackValueChange,
    handleMacroChange,
    handleSubmit,
  } = usePlayerSettings();

  return (
    <main className="min-h-[calc(100vh-var(--topbar-height))] bg-[#101a19] px-4 py-10 text-gray-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
            Preferences
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Settings
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
            Make your table experience feel right for you.
          </p>
        </header>

        {!data && (isLoading || !settingsError) ? (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/75 p-5 text-sm text-gray-400 shadow-xl shadow-black/10 sm:p-7">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
            Loading your settings…
          </div>
        ) : !data && settingsError ? (
          <div
            className="rounded-xl border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-200"
            role="alert"
          >
            <p>{getErrorMessage(settingsError)}</p>
            <button
              type="button"
              onClick={() => void fetchSettings()}
              className="mt-3 font-medium text-red-100 underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        ) : data ? (
          <div className="grid items-start gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
            <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="min-w-0">
              {activeTab === "gameplay" ? (
                <TableGameplaySettings
                  data={data}
                  isSaving={isSaving}
                  saveError={saveError}
                  successMessage={successMessage}
                  onStackViewToggle={handleStackViewToggle}
                  onCardSqueezeToggle={handleCardSqueezeToggle}
                  onStackValueChange={handleStackValueChange}
                  onMacroChange={handleMacroChange}
                  onSubmit={handleSubmit}
                />
              ) : (
                <SettingsPlaceholder tab={activeTab} />
              )}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Settings;
