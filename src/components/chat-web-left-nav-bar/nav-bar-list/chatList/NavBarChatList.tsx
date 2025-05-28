import { useAutoAnimate } from '@formkit/auto-animate/react';
import { FC, memo } from 'react';

import { ChatsListItem } from '../../../../types/chat/chat';
import ChatItem from '../../../chat-item/ChatItem';

type Props = {
  listData: ChatsListItem[];
  isTableBarActive?: boolean;
};

const NavBarChatList: FC<Props> = ({ listData, isTableBarActive }) => {
  const [listRef] = useAutoAnimate();

  return (
    <ul ref={listRef}>
      {listData.map((chat) => {
        return (
          <li key={chat.id}>
            <ChatItem {...chat} isTableBarActive={isTableBarActive} />
          </li>
        );
      })}
    </ul>
  );
};

export default memo(NavBarChatList);
