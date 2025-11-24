import axios from "axios"
import { getApiRoute } from "../helpers/router";

export default class BetService {

    static async bet(tableId, betType, amount = 0) {
        const response = await axios.post(getApiRoute('bet/' + tableId + '/' + betType),
        { amount: amount }
    )

        return response
    }
}