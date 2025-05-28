import { FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';

import {
  NAVIGATION_LINKS,
  NAVIGATION_LINKS_ALL,
} from '../../constant/navLinkObjects';
import { useEventListener } from '../../hooks/useEventListener';

import useUserStore from '../../store/userStore';
import Header from '../header/Header';
import NavigationWrapper from '../navigation-wrapper/NavigationWrapper';
import GlobalSideBar from '../side-bar/GlobalSideBar';

import { ROUTES_SHOW_FOOTER } from '../../constant/url-page.constants';
import Footer from '../footer/Footer';

import style from './globalLayout.module.scss';

const GlobalLayout: FC<PropsWithChildren> = ({ children }) => {
  const [footerShow, setFooterShow] = useState<boolean>(false);

  const location = useLocation();
  const { pathname } = location;

  const user = useUserStore((state) => state.user);

  const globalSideBar = useUserStore((state) => state.globalSideBar);
  const toggleGlobalSideBar = useUserStore(
    (state) => state.toggleGlobalSideBar
  );
  const chatSideBar = useUserStore((state) => state.chatSideBar);
  const toggleChatSideBar = useUserStore((state) => state.toggleChatSideBar);

  const path = useParams();
  const { uid } = path;
  const navigate = useNavigate();

  const lastPartOfRoot = useMemo(() => {
    return pathname.split('/').pop() || '';
  }, [pathname]);

  useEffect(() => {
    setFooterShow(ROUTES_SHOW_FOOTER.includes(lastPartOfRoot));
  }, [lastPartOfRoot]);

  console.log('перерисовка globalLayout 2 уровень после GlobalLayoutPage ');

  const closeSidebarChat = (e: KeyboardEvent) => {
    if (e.code === 'Escape' && globalSideBar) {
      toggleGlobalSideBar();
    }

    if (e.code === 'Escape' && chatSideBar) {
      toggleChatSideBar();
    }

    if (e.code === 'Escape' && uid && !globalSideBar && !chatSideBar) {
      return navigate('../');
    }

    return null;
  };

  useEventListener('keydown', (e) => {
    closeSidebarChat(e);
  });

  return (
    <div className={style.globalLayout} id="globalLayout">
      <GlobalSideBar
        zIndex={300}
        extraClassName={style.navBar}
        outerContainerId="globalLayout"
      >
        <NavigationWrapper
          showImage
          handleActiveNavBar={toggleGlobalSideBar}
          wrapperStyle="wrapperColumnSideBar"
          links={user ? NAVIGATION_LINKS_ALL : NAVIGATION_LINKS}
        />
      </GlobalSideBar>
      <div className={style.globalHeader}>
        <Header />
      </div>
      <div className={style.outlet} id="globalOutlet">
        {children}
      </div>
      {footerShow && <Footer />}
    </div>
  );
};

export default GlobalLayout;
