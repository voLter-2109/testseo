import { useMutation } from '@tanstack/react-query';
import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';

import ChatWindow from '../../../components/chat-select-window/ChatWindow';
import PageTitle from '../../../components/page-title meta/PageTitleMeta';

import { getContactUserByUid } from '../../../api/contact/contact';
import UserNotFoundPopup from '../../../components/popups/user-not-found-popup/UserNotFoundPopup';
import useChatListStore from '../../../store/chatListStore';

import style from './SelectUserChatPage.module.scss';

const SelectUserChatPage: FC = () => {
  const { uid } = useParams();
  // триггер для модального окна
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // триггер показа чата или попапа
  const [shouldRenderChat, setShouldRenderChat] = useState(false);

  // нужен для получения фио собеседника для title
  const userList = useChatListStore((state) => state.userList);
  // если юзера у нас в памяти нет, то запрашиваем и добавляем в общую память
  const addUserInList = useChatListStore((state) => state.addUserInList);
  // проверка на существование юзера в памяти
  const checkUserListByUid = useChatListStore(
    (state) => state.checkUserListByUid
  );

  const { mutate } = useMutation({
    mutationKey: ['check chat on backend', uid],
    mutationFn: (u: string) => {
      return getContactUserByUid({ uid: u });
    },
    onSuccess(res) {
      if (res.data) {
        addUserInList({
          uid: res.data.uid,
          userData: { ...res.data },
        });
        console.log('onSuccess ok data');
      }
      return setShouldRenderChat(true);
    },
    onError() {
      setShouldRenderChat(false);
    },
  });

  useEffect(() => {
    if (uid && !checkUserListByUid(uid)) {
      console.log('mutate');
      return mutate(uid);
    }

    console.log('noooooooo mutate');
    return setShouldRenderChat(true);
  }, [uid, checkUserListByUid]);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const title = useMemo(() => {
    if (uid && userList[uid]) {
      return `${userList[uid].last_name} ${userList[uid].first_name}`;
    }
    return 'doct24';
  }, [uid, userList]);

  return (
    <div className={style.selectUserChatPage}>
      <PageTitle title={title} />
      {shouldRenderChat && uid ? (
        <ChatWindow uid={uid} />
      ) : (
        <UserNotFoundPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          uid={uid}
        />
      )}
    </div>
  );
};

export default SelectUserChatPage;
