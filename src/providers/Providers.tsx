import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FC, PropsWithChildren } from 'react';
import Favicon from 'react-favicon';

import CookieConsent from '../components/cookie-consent/CookieConsent';

import ChatMenu from '../components/menu/ChatMenu/ChatMenu';

import MessageMenu from '../components/menu/MessageMenu/MessageMenu';

import ChannelMenu from '../components/menu/ChannelMenu/ChannelMenu';

import GroupMenu from '../components/menu/GroupMenu/GroupMenu';

import AuthNavigateProvider from './AuthNavigateProvider';
import ThemeProvider from './ThemeProvider';
import WebSocketComponent from './Websoket';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      staleTime: Infinity,
      retry: 2,
      networkMode: 'always',
    },
  },
});

/**
 * @name Providers
 * @param 'QueryClientProvider' - react query для совершения и кеширования запросов на бек
 * @param 'AuthProvider' - проверка доступности для авторизованного пользователя
 * @param 'ReactQueryDevtools' показывает useQuery, мутации не показывает
 * @param 'ThemeProvider' провайдер смены темы, позволяет вытащить из контекста дополнительные переменные для стилей
 */

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthNavigateProvider>
            <WebSocketComponent>
              <Favicon url="img/favicon.ico" />
              <ChatMenu />
              <ChannelMenu />
              <GroupMenu />
              <MessageMenu />
              {children}
              <CookieConsent />
            </WebSocketComponent>
          </AuthNavigateProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen />
      </QueryClientProvider>
    </>
  );
};

export default Providers;
