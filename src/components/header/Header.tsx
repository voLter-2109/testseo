import classNames from 'classnames';
import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  CHAT_PAGE,
  REGISTRATION_PAGE,
} from '../../constant/url-page.constants';

import {
  NAVIGATION_LINKS,
  NAVIGATION_LINKS_ALL,
} from '../../constant/navLinkObjects';
import useWindowResize from '../../hooks/useWindowResize';
import useUserStore from '../../store/userStore';
import Burger from '../../ui/burger/Burger';
import CustomButton from '../../ui/custom-button/Button';
import Logo from '../../ui/logo/Logo';
import NavigationWrapper from '../navigation-wrapper/NavigationWrapper';

import style from './header.module.scss';

const NAVIGATION_RIGHT_MARGIN = 10;
function Header() {
  console.log('перерисовка header идет 3 частью');

  const user = useUserStore((state) => state.user);
  const { pathname } = useLocation();
  const { tableMin, largeDeviseSm } = useWindowResize();

  const globalSideBar = useUserStore((state) => state.globalSideBar);
  const toggleGlobalSideBar = useUserStore(
    (state) => state.toggleGlobalSideBar
  );

  return (
    <header id="header" className={classNames(style.wrapper)}>
      <div className={style.logoWrapper}>
        <Link to={CHAT_PAGE}>
          <Logo size="small" />
        </Link>
      </div>

      <div
        className={style.navigate}
        style={{ marginRight: user ? NAVIGATION_RIGHT_MARGIN : 0 }}
      >
        {!tableMin && (
          <NavigationWrapper
            wrapperStyle="wrapperRow"
            links={user ? NAVIGATION_LINKS_ALL : NAVIGATION_LINKS}
          />
        )}
      </div>
      {!user && !pathname.includes(REGISTRATION_PAGE) && (
        <Link
          to={REGISTRATION_PAGE}
          className={style.registration}
          title="login\registration"
        >
          {pathname !== `/${REGISTRATION_PAGE}` && (
            <CustomButton
              classNameBtn={classNames(style.button)}
              styleBtn="secondary"
              textBtn={user ? 'Выход' : 'Регистрация'}
            />
          )}
        </Link>
      )}
      {!user && pathname.includes(REGISTRATION_PAGE) && largeDeviseSm && (
        <div style={{ width: '135px' }} />
      )}
      {tableMin && (
        <Burger isOpen={globalSideBar} handleClick={toggleGlobalSideBar} />
      )}
    </header>
  );
}

export default memo(Header);
