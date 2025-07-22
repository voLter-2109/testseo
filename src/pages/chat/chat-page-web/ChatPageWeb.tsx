import classNames from 'classnames';
import Cookies from 'js-cookie';
import { FC, useEffect } from 'react';
import { useOutlet } from 'react-router';

import getUserMethods from '../../../api/auth/getUser';
import ChatPageSideBar from '../../../components/chat-left-side-bar/ChatPageSideBar';
import ChatWebNavBar from '../../../components/chat-web-left-nav-bar/ChatWebLeftNavBar';
import PlaceHolderSelectChat from '../../../components/placeholder-select-chat/PlaceHolderSelectChat';
import useWindowResize from '../../../hooks/useWindowResize';
import ToFillOutProfile from '../../../ui/to-fill-out-profile/ToFillOutProfile';

import { REFRESH_TOKEN } from '../../../constant/token.constants';
import ToFillOutRegistration from '../../../ui/to-fill-out-profile/ToFillOutRegistration';

import ChatSideBar from '../../../components/side-bar/ChatSideBar';

import style from './сhatPageWeb.module.scss';

/**
 *
 * @returns страница чата, тут будут самые крупные компоненты страницы
 */
const ChatPageWeb: FC = () => {
  const { table, mobileL } = useWindowResize();

  const { user } = getUserMethods();
  const refresh = Cookies.get(REFRESH_TOKEN);
  const outlet = useOutlet();

  if (!refresh) return <ToFillOutRegistration />;

  if (user && !user.is_filled) return <ToFillOutProfile />;

  useEffect(() => {
    console.log('qweqweqweqwe ChatPageWeb');
  });

  return (
    <>
      {user && user.is_filled ? (
        <div className={style.wrapper} id="chatPageWeb">
          <div
            className={classNames(style.navBar, {
              [style.tableNavBar]: table && !mobileL,
            })}
          >
            <ChatWebNavBar />
            <ChatSideBar outerContainerId="chatPageWeb">
              <ChatPageSideBar />
            </ChatSideBar>
          </div>
          <div className={style.chatWindow}>
            {outlet || <PlaceHolderSelectChat />}
          </div>
        </div>
      ) : (
        <ToFillOutProfile />
      )}
    </>
  );
};

export default ChatPageWeb;
