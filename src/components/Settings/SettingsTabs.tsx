import type { FC } from "react";

export const settingsTabs = [
  { id: "gameplay", label: "Table gameplay" },
  { id: "notifications", label: "Notifications" },
  { id: "appearance", label: "Appearance" },
] as const;

export type SettingsTab = (typeof settingsTabs)[number]["id"];

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const SettingsTabs: FC<SettingsTabsProps> = ({ activeTab, onTabChange }) => (
  <div
    role="tablist"
    aria-label="Settings sections"
    className="flex min-w-0 gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-zinc-900/75 p-2 shadow-xl shadow-black/10 lg:flex-col"
  >
    {settingsTabs.map((tab) => (
      <button
        key={tab.id}
        id={`settings-${tab.id}-tab`}
        type="button"
        role="tab"
        aria-selected={activeTab === tab.id}
        aria-controls={`settings-${tab.id}-panel`}
        onClick={() => onTabChange(tab.id)}
        className={`min-w-max rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
          activeTab === tab.id
            ? "bg-emerald-500/15 text-emerald-300"
            : "text-gray-400 hover:bg-white/5 hover:text-gray-100"
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default SettingsTabs;
