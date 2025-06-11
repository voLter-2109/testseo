import { useState } from 'react';

import useUserStore from '../../store/userStore';

import { CREATE_PROFILE_PAGE } from '../../constant/url-page.constants';

import Divider from '../../ui/divider/Divider';
import ExitButton from '../../ui/exit-button/ExitButton';
import AvatarChangeBlock from '../avatar-change-block/AvatarChangeBlock';
import LinkMobileCheck from '../link-mobile-check/LinkMobileCheck';
import ThemeSwitch from '../theme-switch/ThemeSwitch';

import BlacklistPopup from '../popups/blacklist-popup/BlacklistPopup';

import ServicePopup from '../popups/service-popup/ServicePopup';

import style from './chatPageSideBar.module.scss';

/**
 *
 * @returns меню профиля для side-bar: редактировать, черный список, способ общения, темная тема, выход и т.д.
 */

const ChatPageSideBar = () => {
  const user = useUserStore((state) => state.user);

  // modal черный список
  const [openBLModal, setOpenBLModal] = useState<boolean>(false);
  const [openServiceMes, setOpenServiceMes] = useState<boolean>(false);

  const toggleViewBLPopUp = () => {
    setOpenBLModal((prev) => !prev);
  };

  const toggleServicePopup = () => {
    setOpenServiceMes((prev) => !prev);
  };
  const toggleChatSideBar = useUserStore((state) => state.toggleChatSideBar);

  return (
    <>
      {openBLModal && (
        <BlacklistPopup onClose={toggleViewBLPopUp} isOpen={openBLModal} />
      )}
      {openServiceMes && (
        <ServicePopup onClose={toggleServicePopup} isOpen={openServiceMes} />
      )}
      <div id="chatPageWeb" className={style.layout}>
        <AvatarChangeBlock user={user} />
        <p className={style.name}>
          {user?.last_name
            ? `${user.last_name} ${user.first_name} ${user.patronymic}`
            : 'Фамилия Имя Отчество'}
        </p>
        <div className={style.link}>
          <ul>
            <li>
              <LinkMobileCheck
                to={CREATE_PROFILE_PAGE}
                onClick={toggleChatSideBar}
              >
                <div className={style.edit} />
                Редактировать профиль
              </LinkMobileCheck>
            </li>
            <li>
              <div
                className={style.blacklist_wrapper}
                onClick={() => {
                  toggleChatSideBar();
                  toggleViewBLPopUp();
                }}
              >
                <div className={style.blacklist} />
                Черный список
              </div>
            </li>

            <li>
              <div className={style.swiper_wrapper}>
                <div className={style.theme} />
                Темная тема
                <ThemeSwitch />
              </div>
            </li>
            <li>
              <div
                className={style.service_wrapper}
                onClick={() => {
                  toggleChatSideBar();
                  toggleServicePopup();
                }}
              >
                <div className={style.service} />
                Обращение в службу поддержки
              </div>
            </li>
            <Divider />
            <li>
              <ExitButton />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ChatPageSideBar;
