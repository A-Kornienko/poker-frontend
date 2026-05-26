import { getApiRoute } from "../helpers/router";
import AxiosApiInstance from './AxiosInstans/AxiosApiInstance';

export default class BetService {

    static async bet(tableId: string | number, betType: string, amount: number = 0): Promise<any> {
        const response = await AxiosApiInstance.post(getApiRoute('bet/' + tableId + '/' + betType),
        { amount: amount }
    )

        return response
    }
}