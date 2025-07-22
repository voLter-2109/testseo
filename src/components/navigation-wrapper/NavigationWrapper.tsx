import classNames from 'classnames';
import { FC, useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { SideBarItem } from '../../constant/navLinkObjects';

import { ThemeContext } from '../../providers/ThemeProvider';

import style from './navigationWrapper.module.scss';

interface Props {
  links: SideBarItem[];
  showImage?: boolean;
  wrapperStyle?: string;
  handleActiveNavBar?: () => void;
}

/**
 *
 * @returns компонент для отображения ссылок
 */

const NavigationWrapper: FC<Props> = ({
  links,
  showImage = false,
  wrapperStyle,
  handleActiveNavBar,
}) => {
  console.log('перерисовка NavigationWrapper тот что в header');
  const theme = useContext(ThemeContext);

  return (
    <ul
      className={classNames(style.wrapper, wrapperStyle && style[wrapperStyle])}
    >
      {links.map(({ title, href, image }) => (
        <li className={style.link} key={href}>
          <NavLink
            onClick={handleActiveNavBar}
            className={({ isActive }) =>
              classNames({ [style.active]: isActive })
            }
            to={href}
          >
            {(showImage && image && theme?.theme === 'dark' && image.dark) ||
              (showImage && image && theme?.theme === 'light' && image?.light)}
            {title}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default NavigationWrapper;
