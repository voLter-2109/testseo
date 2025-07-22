import { useAutoAnimate } from '@formkit/auto-animate/react';
import classNames from 'classnames';
import { Dispatch, FC, memo, SetStateAction, useEffect, useState } from 'react';

import useChatListStore from '../../../store/chatListStore';
import { ChatsListItem } from '../../../types/chat/chat';
import CustomButton from '../../../ui/custom-button/Button';
import ReSendUserItem from '../../../ui/re-send-item-user/ReSendUserItem';

import useUserStore from '../../../store/userStore';
import { TChannels } from '../../../types/websoket/websoket.types';

import style from './channelUsers.module.scss';

type TChannelUsersProps = {
  createChannel: (selectChat: string[]) => void;
  setTrigger: () => void;
  selectedUsers: string[];
  setSelectedUsers: Dispatch<SetStateAction<string[]>>;
  loading: boolean;
  error: boolean;
};

interface ChatProps extends ChatsListItem {
  isSelect: boolean;
}

const ChannelUsers: FC<TChannelUsersProps> = ({
  createChannel,
  setTrigger,
  selectedUsers,
  setSelectedUsers,
  loading,
  error,
}) => {
  const user = useUserStore((state) => state.user);
  const [chats, setChats] = useState<ChatProps[]>([]);
  const [listRef] = useAutoAnimate();

  const handleItemClick = (uid: string) => {
    setChats((prevChats) => {
      // Находим индекс объекта с данным id
      const chatIndex = prevChats.findIndex((chat) => chat.chat.uid === uid);
      if (chatIndex === -1) return prevChats; // Если не нашли, ничего не меняем

      // Создаем новый массив с измененным состоянием isSelect
      const updatedChats = prevChats.map((chat) =>
        chat.chat.uid === uid
          ? { ...chat, isSelect: !chat.isSelect } // Меняем значение isSelect
          : chat
      );

      // Разделяем объекты на два массива: с isSelect=true и с isSelect=false
      const selectedChats = updatedChats.filter((chat) => chat.isSelect);
      const unselectedChats = updatedChats.filter((chat) => !chat.isSelect);

      // Перемещаем объекты с isSelect=true в начало, а оставшиеся — после них
      return [...selectedChats, ...unselectedChats];
    });

    setSelectedUsers((prevIds: string[]) => {
      // Добавляем или удаляем id из массива в зависимости от значения isSelect
      return prevIds.includes(uid)
        ? prevIds.filter((itemId) => itemId !== uid) // Если id уже есть, удаляем его
        : [...prevIds, uid]; // Если id нет, добавляем его
    });
  };

  const chatList = useChatListStore((state) => state.chatListStore);

  useEffect(() => {
    setChats(() => {
      return chatList
        .filter((item) => {
          return (
            !item.chat.is_blocked &&
            item.chat_key.includes(TChannels.CHAT) &&
            item.chat.uid !== user?.uid
          );
        })
        .map((item) => {
          return {
            ...item,
            isSelect: false,
          };
        });
    });
  }, [chatList, user]);

  return (
    <div className={style.wrapper}>
      <div className={style.channelUsers}>
        <ul ref={listRef} style={{ overflowY: 'auto' }}>
          {chats.map((item) => {
            return (
              <li
                className={classNames(style.reSendWrapper, {
                  [style.isSelect]: selectedUsers.includes(item.chat.uid),
                })}
                key={item.id}
              >
                <div
                  onClick={() => {
                    handleItemClick(item.chat.uid);
                  }}
                >
                  <ReSendUserItem {...item.chat} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={style.controls}>
        <CustomButton
          type="button"
          textBtn="Назад"
          classNameBtn={style.cancel}
          styleBtn="primary"
          onClick={() => {
            setTrigger();
          }}
        />
        <CustomButton
          type="button"
          textBtn={loading ? 'Создание' : error ? 'Ошибка...' : 'Создать'}
          classNameBtn={style.ok}
          styleBtn="secondary"
          onClick={() => {
            createChannel(selectedUsers);
          }}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default memo(ChannelUsers);
