import Cookies from 'js-cookie';
import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import getUserMethods from '../api/auth/getUser';
import getDoctorMethods from '../api/doctor/getDoctor';
import mutateGetChatListMessage from '../api/use-infinite-query/get-chat-list/getChatListMutation';
import { FIRST_LOGIN } from '../constant/other-constants';
import {
  CHAT_MOBILE_PAGE,
  CHAT_PAGE,
  CREATE_PROFILE_PAGE,
  DOCUMENTS_PAGE,
  DOCUMENTS_PAGE_NAVIGATE,
  OUR_DOCTORS_PAGE,
  POLICY_PERSONAL_DATA_PAGE,
  USER_AGREEMENT_PAGE,
  VERIFICATION_PAGE,
} from '../constant/url-page.constants';
import useNetwork from '../hooks/getNetworkConnection';
import useHandleLogout from '../hooks/useHandleLogout';
import useWindowResize from '../hooks/useWindowResize';
import Preload from '../ui/preloading/Preload';
import getUrl from '../utils/getUrl';

/**
 * @name AuthProvider
 * @description тут будет ProtectedRouter проверка доступности страниц и переадресация на мобильную версию и обратно
 * @returns
 */

const AuthNavigateProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading: isLoadingDoctor } = getDoctorMethods();
  const { user, isLoading: isLoadingUser } = getUserMethods();
  const [isLoading, setIsLoading] = useState(true);
  const { mobileL } = useWindowResize();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const sinceOffline = useRef<number | null>(null);
  const queryClient = useQueryClient();
  const { online, since } = useNetwork();
  const [firstRender, setFirstRender] = useState(false);

  const { isLoadingChatList } = mutateGetChatListMessage();

  const notifySuccess = (text: string) => toast.success(text);
  const notifyError = (text: string) => toast.error(text);

  // useEffect(() => {
  //   console.log('online', online);
  //   console.log('rtt', rtt);
  //   console.log('since', since);
  //   console.log('type', type);
  // }, [online, rtt, since, type]);

  useEffect(() => {
    if (!online) {
      notifyError('Отсутствует подключение к интернету');
    }
    if (online && firstRender) {
      notifySuccess('Сеть восстановлена');
    }
  }, [online]);

  useEffect(() => {
    if (!online && since) {
      sinceOffline.current = new Date(since).getTime();
    }
    if (online && sinceOffline.current) {
      const timeDiff = new Date().getTime() - sinceOffline.current;
      if (timeDiff > 10000) {
        console.log('Обновление данных...');

        // Очистка и повторный запуск всех кешированных запросов
        queryClient.invalidateQueries();
      }
    }
  }, [online, since]);

  useEffect(() => {
    setFirstRender(true);
  }, []);

  const { resetSessionStorage } = useHandleLogout();

  window.addEventListener('beforeunload', () => {
    console.log('API call before page reload');
    resetSessionStorage();
  });

  // const notifySuccess = (text: string) => toast.success(text);
  // const notifyError = (text: string) => toast.error(text);
  const isFirstLogin = Cookies.get(FIRST_LOGIN) === 'true';

  useEffect(() => {
    // console.log('pathname', pathname);
    if (user === null) {
      return;
    }
    if (
      pathname === `/${VERIFICATION_PAGE}` &&
      (!user.is_doctor ||
        (user.is_doctor && user.is_filled && user.is_confirmed_doctor))
    ) {
      if (mobileL) {
        navigate(`/${CHAT_MOBILE_PAGE}`);
      } else navigate(CHAT_PAGE);
    }
    // Проверка на незаполнившего профиль пользователя
    if (user && !user.is_filled && isFirstLogin) {
      if (mobileL) {
        navigate(`/${CHAT_MOBILE_PAGE}/${CREATE_PROFILE_PAGE}`);
        Cookies.set(FIRST_LOGIN, 'false');
      } else {
        navigate(`/${CREATE_PROFILE_PAGE}`);
        Cookies.set(FIRST_LOGIN, 'false');
      }
    } else Cookies.set(FIRST_LOGIN, 'false');

    if (
      user &&
      user.is_doctor &&
      user.is_filled &&
      !user.is_confirmed_doctor &&
      pathname !== `/${OUR_DOCTORS_PAGE}` &&
      pathname !== `/${DOCUMENTS_PAGE_NAVIGATE}` &&
      pathname !== `/${DOCUMENTS_PAGE}/${USER_AGREEMENT_PAGE}` &&
      pathname !== `/${DOCUMENTS_PAGE}/${POLICY_PERSONAL_DATA_PAGE}`
    ) {
      if (mobileL) {
        navigate(`/${CHAT_MOBILE_PAGE}/${VERIFICATION_PAGE}`, {
          replace: true,
        });
      } else navigate(`/${VERIFICATION_PAGE}`, { replace: true });
    }
  }, [pathname, user]);

  useEffect(() => {
    const url = getUrl(mobileL, pathname + search);
    if (url !== pathname + search) {
      navigate(url);
    }
  }, [mobileL, pathname, search, navigate]);

  useEffect(() => {
    // Контроль загрузки через таймаут
    const timeout = setTimeout(() => {
      setIsLoading(isLoadingDoctor || isLoadingUser || isLoadingChatList);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [isLoadingDoctor, isLoadingUser, isLoadingChatList]);

  return <>{isLoading ? <Preload /> : children}</>;
};

export default AuthNavigateProvider;
