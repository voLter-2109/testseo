import { FC, memo } from 'react';
import { Outlet } from 'react-router';

import GlobalLayout from '../../../components/global-layout-web/GlobalLayout';

import ChatMenu from '../../../components/menu/ChatMenu/ChatMenu';
import MessageMenu from '../../../components/menu/MessageMenu/MessageMenu';

const GlobalLayoutPage: FC = () => {
  return (
    <GlobalLayout>
      <Outlet />
      <ChatMenu />
      <MessageMenu />
    </GlobalLayout>
  );
};

export default memo(GlobalLayoutPage);
