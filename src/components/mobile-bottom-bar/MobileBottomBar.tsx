import { FC, useEffect, useState } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';

import { MOBILE_NAVIGATION_LINKS } from '../../constant/navLinkObjects';

import style from './mobileBottomBar.module.scss';

const MobileBottomBar: FC = () => {
  const location = useLocation();
  const params = useParams();

  const isHidden = location.pathname.match(/^\/m\//) && params.uid;
  const [indicatorPosition, setIndicatorPosition] = useState<string>('267px');

  const getIndicatorPosition = (pathname: string): string => {
    switch (pathname) {
      case '/m/our-doctors':
        return '20px';
      case '/m':
        return '127px';
      case '/m/':
        return '127px';

      case '/m/settings':
        return '232px';
      default:
        return '232px';
    }
  };

  useEffect(() => {
    const position = getIndicatorPosition(location.pathname);
    setIndicatorPosition(position);
  }, [location.pathname]);

  return (
    <nav
      className={`${style.container} ${isHidden ? style.container_hidden : ''}`}
    >
      <ul>
        {MOBILE_NAVIGATION_LINKS.map((item, index) => (
          <NavLink
            end
            key={item.path}
            to={item.path}
            style={({ isActive }) =>
              !isActive
                ? {
                    marginTop:
                      index === 2 && indicatorPosition === '232px'
                        ? '-5px'
                        : '20px',
                    marginBottom:
                      index === 2 && indicatorPosition === '232px'
                        ? '-5px'
                        : '20px',
                  }
                : undefined
            }
          >
            <li>
              <img src={item.icon} alt={item.label} />
              <p>{item.label}</p>
            </li>
          </NavLink>
        ))}
        <div className={style.indicator} style={{ left: indicatorPosition }} />
      </ul>
    </nav>
  );
};

export default MobileBottomBar;
