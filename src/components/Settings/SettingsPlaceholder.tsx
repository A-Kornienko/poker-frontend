import type { FC } from "react";
import type { SettingsTab } from "./SettingsTabs";

interface SettingsPlaceholderProps {
  tab: Exclude<SettingsTab, "gameplay">;
}

const SettingsPlaceholder: FC<SettingsPlaceholderProps> = ({ tab }) => {
  const title = tab === "notifications" ? "Notifications" : "Appearance";
  const description =
    tab === "notifications"
      ? "Notification preferences will be available here soon."
      : "Appearance preferences will be available here soon.";

  return (
    <section
      id={`settings-${tab}-panel`}
      role="tabpanel"
      aria-labelledby={`settings-${tab}-tab`}
      tabIndex={0}
      className="rounded-2xl border border-white/10 bg-zinc-900/75 p-5 shadow-xl shadow-black/10 sm:p-7"
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
        Coming soon
      </p>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-gray-400">{description}</p>
    </section>
  );
};

export default SettingsPlaceholder;
