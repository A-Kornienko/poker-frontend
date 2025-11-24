import Cookies from 'js-cookie';
import AxiosApiInstance from '../AxiosApiInstance';
import { getApiRoute } from '../../helpers/router';
import { clearAuthTokens } from '../../helpers/authUtils'; // Ваша нова утиліта

/**
 * Performs logout operation by invalidating the refresh token on the server 
 * and removing all tokens from the client.
 */
export default class logoutService {

  static async logout() {
    const refreshToken = Cookies.get('refresh_token');

    // We are using an instance with interceptors. The Access Token will be added automatically.
    try {
      // We send a request to the server to remove the Refresh Token from the database
      await AxiosApiInstance.post(getApiRoute('auth/logout'), { 
        refresh_token: refreshToken 
      });
    } catch (error) {
      // If the server returns a 401 or other error during logout
      console.error("Logout request failed or server returned error, cleaning up locally...", error);
    } finally {
      // IMPORTANT: Clear all tokens on the client regardless of the server response
      clearAuthTokens();
    }
  }

};