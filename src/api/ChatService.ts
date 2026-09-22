import AxiosApiInstance from "./AxiosInstans/AxiosApiInstance";
import Cookies from "js-cookie";
import { getApiRoute } from "../helpers/router";

export interface ChatMessage {
  id: number | string;
  message: string;
  user: string;
  avatar?: string | null;
  isCurrentUser?: boolean;
}

export interface ChatPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ChatHistoryResponse {
  items: ChatMessage[] | Record<string, ChatMessage>;
  pagination: ChatPagination;
}

export default class ChatService {
  static async getHistory(
    tableId: number | string,
    page = 1,
    limit = 30,
  ): Promise<ChatHistoryResponse> {
    const response = await AxiosApiInstance.get<ChatHistoryResponse>(
      getApiRoute(`chat/${tableId}/history`),
      { params: { page, limit } },
    );

    return response.data;
  }

  static getMessagesSSE(tableId: number | string): EventSource {
    const token = Cookies.get("access_token");
    if (!token) {
      throw new Error("Authentication token (access_token) not found.");
    }

    return new EventSource(`${getApiRoute(`chat/${tableId}`)}?token=${token}`);
  }

  static async sendMessage(
    tableId: number | string,
    message: string,
  ): Promise<ChatMessage | undefined> {
    const response = await AxiosApiInstance.post<ChatMessage>(
      getApiRoute(`chat/${tableId}/send`),
      { message },
    );

    return response.data;
  }
}