import axios from "axios"
import { getApiRoute } from "../helpers/router";

export default class PokerTableService {

    static async getPlayersInfo(settingId) {
        const response = await axios.get(getApiRoute('cash-tables/' + settingId + '/players'))

        return response
    }
}