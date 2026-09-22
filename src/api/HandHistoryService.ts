import AxiosApiInstance from "./AxiosInstans/AxiosApiInstance";
import { getApiRoute } from "../helpers/router";
import {
  HandHistoryDetails,
  HandHistoryDetailsResponse,
  HandHistoryItem,
  HandHistoryListResponse,
  HandHistoryPagination,
} from "../types/handHistory";

export interface HandHistoryPage {
  items: HandHistoryItem[];
  pagination: HandHistoryPagination;
}

export default class HandHistoryService {
  static async getTableHistory(
    tableId: number | string,
    page = 1,
    limit = 20,
  ): Promise<HandHistoryPage> {
    const response = await AxiosApiInstance.get<HandHistoryListResponse>(
      getApiRoute(`table-history/${tableId}`),
      { params: { page, limit } },
    );

    const { items, pagination } = response.data.data;

    return {
      items: Object.entries(items).map(([session, item]) => ({
        session,
        ...item,
      })),
      pagination,
    };
  }

  static async getDetails(session: string): Promise<HandHistoryDetails> {
    const response = await AxiosApiInstance.get<HandHistoryDetailsResponse>(
      getApiRoute(`table-history/details/${session}`),
    );

    return response.data.data;
  }
}
