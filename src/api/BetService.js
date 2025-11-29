import axios from "axios"
import { getApiRoute } from "../helpers/router";
import AxiosApiInstance from './AxiosInstans/AxiosApiInstance';

export default class BetService {

    static async bet(tableId, betType, amount = 0) {
        const response = await AxiosApiInstance.post(getApiRoute('bet/' + tableId + '/' + betType),
        { amount: amount }
    )

        return response
    }
}