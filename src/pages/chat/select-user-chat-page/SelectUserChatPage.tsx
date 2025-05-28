import { FC, useMemo } from 'react';
import { useParams } from 'react-router';

import ChatWindow from '../../../components/chat-select-window/ChatWindow';

import PageTitle from '../../../components/page-title meta/PageTitleMeta';

import chatListStore from '../../../store/chatListStore';

import style from './SelectUserChatPage.module.scss';

const SelectUserChatPage: FC = () => {
  const { uid } = useParams();

  const userList = chatListStore((state) => state.userList);

  const title: string = useMemo(() => {
    if (uid && Object.prototype.hasOwnProperty.call(userList, uid)) {
      return `${userList[uid].last_name} ${userList[uid].first_name}`;
    }
    return 'doct24';
  }, [uid, userList]);

  return (
    <div className={style.selectUserChatPage}>
      <PageTitle title={title} />
      <ChatWindow uid={uid || null} />
    </div>
  );
};

export default SelectUserChatPage;
