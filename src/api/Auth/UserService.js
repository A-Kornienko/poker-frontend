import { getApiRoute } from "../../helpers/router";
import AxiosApiInstance from '../AxiosInstans/AxiosApiInstance';

export default class UserService {

    static async getUser() {
        const response = await AxiosApiInstance.get(getApiRoute('auth/user'));

        return response
    }
}