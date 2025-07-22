import axios from 'axios';
import Cookies from 'js-cookie';

import { removeNullConsent } from '../components/cookie-consent/CookieConsent';
import { FIRST_LOGIN } from '../constant/other-constants';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constant/token.constants';

import { SERVER_API } from './api-config';

export const removeTokens = () => {
  Cookies.remove(ACCESS_TOKEN);
  Cookies.remove(REFRESH_TOKEN);
  Cookies.remove(FIRST_LOGIN);
  document.cookie = `${ACCESS_TOKEN}=`;
  document.cookie = `${REFRESH_TOKEN}=`;
  removeNullConsent();
};

export const setTokens = (access: string, refresh: string) => {
  // console.log(navigator.cookieEnabled);
  document.cookie = `${ACCESS_TOKEN}=${access}`;
  document.cookie = `${REFRESH_TOKEN}=${refresh}`;

  // ! задание настроить куки. на телефоне не работает
  Cookies.set(ACCESS_TOKEN, access, {
    secure: true,
    sameSite: 'strict',
  });
  Cookies.set(REFRESH_TOKEN, refresh, {
    secure: true,
    sameSite: 'strict',
  });
  Cookies.set(FIRST_LOGIN, 'true');
};

export const getNewTokens = async () => {
  const refresh = Cookies.get(REFRESH_TOKEN);
  const refreshRes = await axios.post(
    `${SERVER_API}/auth/login/refresh/token/`,
    {
      refresh,
    }
  );
  const { access: newAccessToken, refresh: newRefreshToken } = refreshRes.data;

  return { newAccessToken, newRefreshToken };
};
