import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

import { ACCESS_TOKEN } from '../constant/token.constants';
import { ErrorWithRetry } from '../types/api/errorWithRetry';

import mainApi from './api-config';

import { getNewTokens, removeTokens, setTokens } from './apiService';

export const apiClassic = axios.create(mainApi);
export const apiWithAuth = axios.create(mainApi);

apiWithAuth.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get(ACCESS_TOKEN);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiWithAuth.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest: ErrorWithRetry | undefined = error.config;
    if (
      error?.response?.status === 401 &&
      originalRequest &&
      !originalRequest.isRetry
    ) {
      originalRequest.isRetry = true;

      try {
        const { newAccessToken, newRefreshToken } = await getNewTokens();
        setTokens(newAccessToken, newRefreshToken);
        return await apiWithAuth.request(originalRequest);
      } catch (refreshErr) {
        removeTokens();
        return Promise.reject(refreshErr);
      }
    }
    throw error;
  }
);
