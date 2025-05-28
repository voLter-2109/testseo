import Cookies from 'js-cookie';
import { FC, useEffect, useMemo, useState } from 'react';
import { useLocation, useOutlet } from 'react-router';

import getUserMethods from '../../../api/auth/getUser';

import ChatWebNavBar from '../../../components/chat-web-left-nav-bar/ChatWebLeftNavBar';
import MobileBottomBar from '../../../components/mobile-bottom-bar/MobileBottomBar';
import { ROUTES_SHOW_BOTTOM_BAR } from '../../../constant/url-page.constants';
import ToFillOutProfile from '../../../ui/to-fill-out-profile/ToFillOutProfile';

import { REFRESH_TOKEN } from '../../../constant/token.constants';
import ToFillOutRegistration from '../../../ui/to-fill-out-profile/ToFillOutRegistration';

import style from './ChatPageMobile.module.scss';

const ChatPageMobile: FC = () => {
  const [BottomBarShow, setBottomBarShow] = useState<boolean>(false);
  const location = useLocation();
  const { pathname } = location;
  const outlet = useOutlet();
  const refresh = Cookies.get(REFRESH_TOKEN);

  const { user } = getUserMethods();

  const lastPartOfRoot = useMemo(() => {
    return pathname.split('/').pop() || '';
  }, [pathname]);

  useEffect(() => {
    setBottomBarShow(
      ROUTES_SHOW_BOTTOM_BAR.includes(lastPartOfRoot) ||
        pathname === '/m' ||
        pathname === '/m/'
    );
  }, [lastPartOfRoot, pathname]);

  if (!refresh)
    return (
      <div className={style.wrapper}>
        <div className={style.content}>
          {outlet || <ToFillOutRegistration />}
        </div>
        {BottomBarShow && <MobileBottomBar />}
      </div>
    );

  if (user && !user.is_filled)
    return (
      <div className={style.wrapper}>
        <div className={style.content}>{outlet || <ToFillOutProfile />}</div>
        {BottomBarShow && <MobileBottomBar />}
      </div>
    );

  return (
    <div className={style.wrapper}>
      <div className={style.content}>{outlet || <ChatWebNavBar />}</div>
      {BottomBarShow && <MobileBottomBar />}
    </div>
  );
};
export default ChatPageMobile;
