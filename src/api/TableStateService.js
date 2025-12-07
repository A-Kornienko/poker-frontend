import { getApiRoute } from "../helpers/router";
import Cookies from 'js-cookie';

export default class TableStateService {

    static getTableStateSSE(tableId) {

        const token = Cookies.get('access_token');
        if (!token) {
            // if token is not found, throw an error or handle it appropriately
            throw new Error("Authentication token (access_token) not found.");
        }

        const url = `table-state/${tableId}?token=${token}`;
        const eventSource = new EventSource(getApiRoute(url));

        return eventSource;
    }
}