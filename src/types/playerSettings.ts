export interface PlayerSettingOption {
	name: string;
	value: string;
}

export interface StackViewSettings {
	active: boolean;
	currency: PlayerSettingOption;
	value: PlayerSettingOption;
}

export type MacroStreet = "preflop" | "postflop";

export type ButtonMacroValues = Record<string, number>;

export interface ButtonMacrosSettings {
	preflop: ButtonMacroValues;
	postflop: ButtonMacroValues;
}

export interface PlayerSettings {
	stackView: StackViewSettings;
	cardSqueeze: boolean;
	buttonMacros: ButtonMacrosSettings;
}

export interface PlayerSettingsResponse extends PlayerSettings {
	stackViewCurrencyOptions: Record<string, string>;
	buttonMacrosOptions: Record<MacroStreet, ButtonMacroValues>;
	isAuthorized?: boolean;
}
