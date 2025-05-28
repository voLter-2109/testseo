import { FC, useContext } from 'react';

import ChatPageSideBar from '../../components/chat-left-side-bar/ChatPageSideBar';
import LinkMobileCheck from '../../components/link-mobile-check/LinkMobileCheck';
import { REGISTRATION_PAGE } from '../../constant/url-page.constants';
import useUserStore from '../../store/userStore';
import CustomButton from '../../ui/custom-button/Button';

import { ReactComponent as LoginIconBlack } from '../../assets/header/sign_black.svg';
import { ReactComponent as LoginIconWhite } from '../../assets/header/sign_white.svg';
import { ThemeContext } from '../../providers/ThemeProvider';

import NavigationWrapper from '../../components/navigation-wrapper/NavigationWrapper';
import { NAVIGATION_LINKS } from '../../constant/navLinkObjects';
import useWindowResize from '../../hooks/useWindowResize';

import style from './settingsMobilePage.module.scss';

const SettingsMobilePage: FC = () => {
  const { user } = useUserStore((state) => state);
  const theme = useContext(ThemeContext);
  const { mobileL } = useWindowResize();

  return (
    <div className={style.wrapper}>
      {!user ? (
        <>
          <div>
            <NavigationWrapper
              showImage
              wrapperStyle="wrapperColumnSideBar"
              links={NAVIGATION_LINKS.map((item) => {
                const link = mobileL ? `/m/${item.href}` : `/${item.href}`;
                return { ...item, href: link };
              })}
            />
          </div>
          <LinkMobileCheck to={REGISTRATION_PAGE}>
            <CustomButton classNameBtn={style.button} styleBtn="secondary">
              {theme?.theme === 'light' ? (
                <LoginIconWhite />
              ) : (
                <LoginIconBlack />
              )}
              Вход / Регистрация
            </CustomButton>
          </LinkMobileCheck>
        </>
      ) : (
        <ChatPageSideBar />
      )}
    </div>
  );
};

export default SettingsMobilePage;
