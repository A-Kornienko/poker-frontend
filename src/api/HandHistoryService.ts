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

export interface HandHistoryFilters {
  dateFrom?: string;
  dateTo?: string;
}

export default class HandHistoryService {
  static async getTableHistory(
    tableId: number | string,
    page = 1,
    limit = 20,
    filters: HandHistoryFilters = {},
  ): Promise<HandHistoryPage> {
    const params: {
      page: number;
      limit: number;
      dateFrom?: string;
      dateTo?: string;
    } = { page, limit };

    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;

    const response = await AxiosApiInstance.get<HandHistoryListResponse>(
      getApiRoute(`table-history/${tableId}`),
      { params },
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
