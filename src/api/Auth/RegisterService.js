import axios from "axios"
import { getApiRoute } from "../../helpers/router";

export default class RegisterService {

    static async register(email, login, password) {
        const response = await axios.post(getApiRoute('auth/register'),
        { email: email, login: login, password: password }
    )

        return response
    }
}