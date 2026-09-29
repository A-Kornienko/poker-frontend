import { getApiRoute } from "../helpers/router";
import AxiosApiInstance from "./AxiosInstans/AxiosApiInstance";
import type {
  PlayerSettings,
  PlayerSettingsResponse,
} from "../types/playerSettings";

export default class PlayerSettingsService {
  static async getPlayerSettings(): Promise<PlayerSettingsResponse> {
    const response = await AxiosApiInstance.get<{ data: PlayerSettingsResponse }>(
      getApiRoute("player-setting"),
    );

    return response.data.data;
  }

  static async updatePlayerSettings(settings: PlayerSettings): Promise<void> {
    await AxiosApiInstance.put(getApiRoute("player-setting"), settings);
  }
}
