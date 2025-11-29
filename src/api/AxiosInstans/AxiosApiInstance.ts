import axios from 'axios';
import Cookies from 'js-cookie';
import { getApiRoute } from '../../helpers/router';
import { clearAuthTokens } from '../../helpers/authUtils';

const AxiosApiInstance = axios.create({
  // withCredentials: true, 
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(p => {
    error ? p.reject(error) : p.resolve(token);
  });
  failedQueue = [];
};

// Interceptor for adding a Bearer token
AxiosApiInstance.interceptors.request.use(config => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor for handling 401 (refresh token or logout)
AxiosApiInstance.interceptors.response.use(
  response => response,
  async error => {
    
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return AxiosApiInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = Cookies.get('refresh_token');

        // this request should also go through AxiosApiInstance (or at least withCredentials)
        const refreshResponse = await axios.post(
          getApiRoute('token/refresh'),
          { refresh_token: refreshToken },
          // { withCredentials: true } // so that the refresh_token cookie is sent
        );

        const { token: newAccessToken, refresh_token: newRefreshToken } = refreshResponse.data;

        // Updating cookies
        Cookies.set('access_token', newAccessToken, { expires: 1 / 24, secure: true, sameSite: 'strict' });
        if (newRefreshToken) {
          Cookies.set('refresh_token', newRefreshToken, { expires: 30, secure: true, sameSite: 'strict' });
        }

        const tokenToUse = newAccessToken;

        processQueue(null, tokenToUse);
        originalRequest.headers.Authorization = `Bearer ${tokenToUse}`;

        return AxiosApiInstance(originalRequest);
      } catch (refreshError) {
        clearAuthTokens()
        processQueue(refreshError, null);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Add 403 Forbidden handling
    if (error.response?.status === 403) {
        console.error("403 Forbidden: User authenticated but has no permission.");
        // Possibly redirect to "Access Denied" page
        // window.location.href = '/access-denied';
    }

    return Promise.reject(error);
  }
);

export default AxiosApiInstance;