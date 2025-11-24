import axios from "axios"
import { getApiRoute } from "../helpers/router";

export default class TableStateService {

    static getTableStateSSE(tableId) {
        return new EventSource(getApiRoute('table-state/' + tableId));
    }
}