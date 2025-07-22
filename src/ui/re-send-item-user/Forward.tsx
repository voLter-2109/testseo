import { useAutoAnimate } from '@formkit/auto-animate/react';
import classNames from 'classnames';
import { FC, memo, useContext, useEffect, useState } from 'react';

import { ChatsListItem } from '../../types/chat/chat';

import useChatListStore from '../../store/chatListStore';

import Button from '../custom-button/Button';

import { WebSocketContext } from '../../providers/Websoket';

import { MessageListItem } from '../../types/chat/messageListItem';

import { TChannels } from '../../types/websoket/websoket.types';

import ReSendUserItem from './ReSendUserItem';

import style from './reSendUserItem.module.scss';

interface FrowardProps {
  resetSelectMesForward: () => void;
  selectedMessagesForward: MessageListItem[];
  toggleForwardPopup: () => void;
}

interface ChatProps extends ChatsListItem {
  isSelect: boolean;
}

const Forward: FC<FrowardProps> = ({
  resetSelectMesForward,
  selectedMessagesForward,
  toggleForwardPopup,
}) => {
  const [chats, setChats] = useState<ChatProps[]>([]);
  const [selectChat, setSelectChat] = useState<string[]>([]);
  const [listRef] = useAutoAnimate();

  const contextSocket = useContext(WebSocketContext);

  const { handleCreateTextMessage } = contextSocket ?? {};

  const handleResetSelectChat = () => {
    toggleForwardPopup();
    setChats([]);
    setSelectChat([]);
    resetSelectMesForward();
  };

  const sendMessage = (uidChat: string[]) => {
    if (handleCreateTextMessage && selectChat.length > 0) {
      toggleForwardPopup();

      uidChat.forEach((item, index) => {
        // TODO: forwarding from channels and groups
        handleCreateTextMessage({
          chatKey: '',
          type: TChannels.CHAT,
          toUserUid: item,
          content: {
            textContent: ' ',
            fileBlob: [],
            filesForLoading: [],
            forwardedMessages: selectedMessagesForward,
            repliedMEssage: [],
          },
          resetValue: null,
        });

        if (index === uidChat.length - 1) {
          handleResetSelectChat();
        }
      });
    }
  };

  const chatList = useChatListStore((state) => state.chatListStore);

  useEffect(() => {
    setChats(() => {
      return chatList
        .filter((item) => {
          return !item.chat.is_blocked;
        })
        .map((item) => {
          return {
            ...item,
            isSelect: false,
          };
        });
    });
  }, [chatList]);

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

    setSelectChat((prevIds) => {
      // Добавляем или удаляем id из массива в зависимости от значения isSelect
      return prevIds.includes(uid)
        ? prevIds.filter((itemId) => itemId !== uid) // Если id уже есть, удаляем его
        : [...prevIds, uid]; // Если id нет, добавляем его
    });
  };

  return (
    <div className={style.forwardWrapper}>
      <h2 style={{ marginBlock: '10px' }}>
        {selectedMessagesForward.length} Переслать...
      </h2>
      <ul ref={listRef} style={{ overflowY: 'auto' }}>
        {chats.map((item) => {
          return (
            <li
              className={classNames(style.reSendWrapper, {
                [style.isSelect]: selectChat.includes(item.chat.uid),
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
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginTop: '10px',
          justifyContent: 'space-between',
        }}
      >
        <Button
          classNameBtn={style.fBtn}
          textBtn="Отмена"
          onClick={handleResetSelectChat}
        />
        <Button
          classNameBtn={style.fBtn}
          textBtn="Отправить"
          disabled={Boolean(!selectChat.length)}
          onClick={() => {
            sendMessage(selectChat);
          }}
        />
      </div>
    </div>
  );
};

export default memo(Forward);
