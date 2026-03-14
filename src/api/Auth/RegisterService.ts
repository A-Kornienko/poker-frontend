import axios from "axios"
import { getApiRoute } from "../../helpers/router";

export default class RegisterService {

    static async register(email: string, login: string, password: string): Promise<any> {
        const response = await axios.post(getApiRoute('auth/register'),
        { email: email, login: login, password: password }
    )

        return response
    }
}