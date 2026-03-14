import { getApiRoute } from "../helpers/router";
import AxiosApiInstance from './AxiosInstans/AxiosApiInstance';

export default class RebuyService {

    static async rebuy(tableId: string | number, chips: number): Promise<any> {
        const response = await AxiosApiInstance.post(getApiRoute(tableId + '/rebuy' ),
        { chips: chips }
    )

        return response
    }
}