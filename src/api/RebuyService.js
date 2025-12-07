import { getApiRoute } from "../helpers/router";
import AxiosApiInstance from './AxiosInstans/AxiosApiInstance';

export default class RebuyService {

    static async rebuy(tableId, chips) {
        const response = await AxiosApiInstance.post(getApiRoute(tableId + '/rebuy' ),
        { chips: chips }
    )

        return response
    }
}