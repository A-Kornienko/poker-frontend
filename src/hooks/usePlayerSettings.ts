import { useEffect, useState, type FormEvent } from "react";
import PlayerSettingsService from "../api/PlayerSettingsService";
import { useFetching } from "./useFetching";
import type {
  MacroStreet,
  PlayerSettings,
  PlayerSettingsResponse,
} from "../types/playerSettings";

const usePlayerSettings = () => {
  const [data, setData] = useState<PlayerSettingsResponse | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [fetchSettings, isLoading, settingsError] = useFetching(async () => {
    const response = await PlayerSettingsService.getPlayerSettings();
    setData(response);
  });

  const [saveSettings, isSaving, saveError] = useFetching(async () => {
    if (!data) return;

    const { stackView, cardSqueeze, buttonMacros } = data;
    const settings: PlayerSettings = { stackView, cardSqueeze, buttonMacros };

    await PlayerSettingsService.updatePlayerSettings(settings);
    setSuccessMessage("Your settings have been saved.");
  });

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  const updateSettings = (update: (settings: PlayerSettings) => PlayerSettings) => {
    setData((current) => (current ? { ...current, ...update(current) } : current));
    setSuccessMessage("");
  };

  const handleStackViewToggle = () => {
    if (!data) return;
    updateSettings((settings) => ({
      ...settings,
      stackView: { ...settings.stackView, active: !settings.stackView.active },
    }));
  };

  const handleCardSqueezeToggle = () => {
    if (!data) return;
    updateSettings((settings) => ({ ...settings, cardSqueeze: !settings.cardSqueeze }));
  };

  const handleStackValueChange = (selectedValue: string) => {
    if (!data) return;

    const option = Object.entries(data.stackViewCurrencyOptions).find(
      ([value]) => value === selectedValue,
    );
    if (!option) return;

    const [value, name] = option;
    updateSettings((settings) => ({
      ...settings,
      stackView: { ...settings.stackView, value: { name, value } },
    }));
  };

  const handleMacroChange = (
    street: MacroStreet,
    button: string,
    selectedValue: string,
  ) => {
    const value = Number(selectedValue);
    if (!Number.isFinite(value) || value < 0) return;

    updateSettings((settings) => ({
      ...settings,
      buttonMacros: {
        ...settings.buttonMacros,
        [street]: { ...settings.buttonMacros[street], [button]: value },
      },
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!data) return;

    setSuccessMessage("");
    void saveSettings();
  };

  return {
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
  };
};

export default usePlayerSettings;
