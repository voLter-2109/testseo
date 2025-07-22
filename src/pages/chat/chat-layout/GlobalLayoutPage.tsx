import { FC, memo } from 'react';
import { Outlet } from 'react-router';

import GlobalLayout from '../../../components/global-layout-web/GlobalLayout';

const GlobalLayoutPage: FC = () => {
  return (
    <GlobalLayout>
      <Outlet />
    </GlobalLayout>
  );
};

export default memo(GlobalLayoutPage);
