import Cookies from 'js-cookie';
import AxiosApiInstance from '../AxiosInstans/AxiosApiInstance';
import { getApiRoute } from '../../helpers/router';

/**
 * Performs logout operation by invalidating the refresh token on the server 
 * and removing all tokens from the client.
 */
export default class logoutService {

  static async logout() {
    const refreshToken = Cookies.get('refresh_token');
      // We send a request to the server to remove the Refresh Token from the database
      await AxiosApiInstance.post(getApiRoute('auth/logout'), { 
        refresh_token: refreshToken 
      });
  }

};