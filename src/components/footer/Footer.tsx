import { FC } from 'react';

import Divider from '../../ui/divider/Divider';
import Logo from '../../ui/logo/Logo';

import {
  NAVIGATION_LINKS,
  NAVIGATION_LINKS_ALL,
} from '../../constant/navLinkObjects';
import NavigationWrapper from '../navigation-wrapper/NavigationWrapper';

import useUserStore from '../../store/userStore';

import style from './footer.module.scss';

/**
 *
 * @returns основная оболочка с header
 */

const Footer: FC = () => {
  const { user } = useUserStore((state) => state);

  return (
    <footer id="footer" className={style.wrapper}>
      <div className={style.main}>
        <div className={style.logoWrapper}>
          <Logo size="big" />
        </div>
        <div className={style.container}>
          <h3>Главное</h3>
          <NavigationWrapper
            wrapperStyle="wrapperColumn"
            links={user ? NAVIGATION_LINKS_ALL : NAVIGATION_LINKS}
          />
        </div>
        <div className={style.container}>
          <h3>Контакты</h3>
          <p>г.Москва</p>
          <a href="tel:+71111111111">+7 (111) 111-11-11</a>
          <a href="mailto:info@doct24.ru" rel="noreferrer" target="_blank">
            info@info.ru
          </a>
          <div className={style.social}>
            <a className={style.tg} href="/" target="_blank">
              {/* Иконка Telegram */}
            </a>
            <a className={style.ok} href="/" target="_blank">
              {/* Иконка Одноклассники */}
            </a>
            <a className={style.vk} href="/" target="_blank">
              {/* Иконка Вконтакте */}
            </a>
          </div>
        </div>
      </div>
      <Divider />
      <div className={style.info}>
        <p>
          Информация на сайте является ознакомительной и не может заменить
          консультацию врача.
        </p>
        <div>
          <span className={style.google}> </span>
          <span className={style.store}> </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
