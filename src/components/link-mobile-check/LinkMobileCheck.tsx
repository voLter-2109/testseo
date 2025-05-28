import { FC, PropsWithChildren } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

import useWindowResize from '../../hooks/useWindowResize';

/**
 * @description проверяет mobileL (мобильная ли версия)
 * @prop {string} to: путь из констант (пример: to={CREATE_PROFILE_PAGE})
 * @returns если mobileL , добавляет к пути /m
 */

const LinkMobileCheck: FC<PropsWithChildren<NavLinkProps>> = ({
  to,
  children,
  ...linkProps
}) => {
  const { mobileL } = useWindowResize();
  return (
    <NavLink {...linkProps} to={mobileL ? `/m/${to}` : `/${to}`}>
      {children}
    </NavLink>
  );
};

export default LinkMobileCheck;
