import axios from "axios"
import { getApiRoute } from "../../helpers/router";

export default class LoginService {

    static async login(email: string, password: string): Promise<any> {
        const response = await axios.post(getApiRoute('auth/login'),
        { email: email, password: password }
    )

        return response
    }
}