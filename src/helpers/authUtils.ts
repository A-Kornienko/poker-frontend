import Cookies from 'js-cookie';

export const clearAuthTokens = (): void => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
};