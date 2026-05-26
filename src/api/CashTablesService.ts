import axios from "axios"
import { getApiRoute } from "../helpers/router";
import AxiosApiInstance from './AxiosInstans/AxiosApiInstance';

export default class CashTablesService {
    static async getTableList(limit: number = 10, page: number = 1): Promise<any> {
        const response = await axios.get(getApiRoute('cash-tables'),
            {
                params: {
                    limit: limit,
                    page: page
                },

            })
        return response
    }

    static async getPlayersInfo(settingId: string | number): Promise<any> {
        const response = await axios.get(getApiRoute('cash-tables/' + settingId + '/players'))

        return response
    }

    static async getSettingDetails(settingId: string | number): Promise<any> {
        const response = await axios.get(getApiRoute('cash-tables/' + settingId))

        return response
    }

    static async connectToTable(settingId: string | number, stack: number): Promise<any> {

        const response = await AxiosApiInstance.post(getApiRoute('cash-tables/' + settingId + '/connect'),
            {
                stack: stack
            }
        )

        return response
    }

    static async leaveTable(tableId: string | number): Promise<any> {
        const response = await AxiosApiInstance.post(getApiRoute('cash-tables/' + tableId + '/leave'))

        return response
    }
}