/* eslint-disable @typescript-eslint/naming-convention */
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { MessageListItem } from '../types/chat/messageListItem';

// интерфейс данных которые принимает фукнция после rest запроса
interface ISetMessageOnStorage {
  uid: string;
  position: 'next' | 'previous' | null;
  messageList: MessageListItem[] | undefined;
}

// структура всего хранилища
interface IMessageListStore {
  messageListStore: Record<string, MessageListItem[]>;
  triggerCloseSearch: number;
  setMessageRestApi: ({
    uid,
    messageList,
    position,
  }: ISetMessageOnStorage) => void;
  getMessageListByUid: (uid: string) => MessageListItem[] | null;
  setMessageFromSocket: ({
    uid,
    messageList,
  }: {
    uid: string;
    messageList: MessageListItem[];
  }) => void;
  setUpdatedLoadingMessageFromSocket({
    request_uid,
    to_user_uid,
    messageList,
  }: {
    request_uid: string | null;
    to_user_uid: string;
    messageList: MessageListItem[];
  }): void;
  setUpdatedErrorMessageFromSocket({
    request_uid,
    to_user_uid,
  }: {
    request_uid: string | null;
    to_user_uid: string;
  }): void;
  clearStoreMessageList: () => void;
  deleteChat: (uid: string) => void;
  setChangeTriggerCloseSearch: () => void;
  hasOwnProperty: (uid: string) => boolean;
  deleteMessage: (
    uid: string,
    id: number | null,
    request_uid: string | null
  ) => void;
  updateMessage: (uid: string, id: number, messageContent: string) => void;
  updateStatusMessage: ({
    uidUser,
    messageUid,
  }: {
    uidUser: string;
    messageUid: string;
  }) => void;
}

const initialChatListStore = {
  messageListStore: {},
  triggerCloseSearch: 0,
};

const useMessageListStore = create<IMessageListStore>()(
  persist(
    devtools(
      immer((set, get) => ({
        ...initialChatListStore,
        setChangeTriggerCloseSearch: () => {
          set(
            (state) => {
              state.triggerCloseSearch += 1;
            },
            false,
            'trigger close search'
          );
        },
        getMessageListByUid: (uid) => {
          const list = get().messageListStore[uid];
          if (list) return list;

          return null;
        },
        // метод записи сообщений rest
        setMessageRestApi: ({ uid, messageList, position }) =>
          set(
            (state) => {
              console.log(position);
              if (messageList && messageList.length) {
                state.messageListStore[uid] = [...messageList];
              }
            },
            false,
            'set message list store with rest api'
          ),
        setMessageFromSocket: ({ uid, messageList }) =>
          set(
            (state) => {
              if (state.messageListStore[uid]) {
                state.messageListStore[uid] = [
                  ...state.messageListStore[uid],
                  ...messageList,
                ];
              }

              if (!state.messageListStore[uid]) {
                state.messageListStore[uid] = [...messageList];
              }
            },
            false,
            'add message in chat'
          ),
        // обновление сообщения об отправке на реальное
        setUpdatedLoadingMessageFromSocket: ({
          request_uid,
          to_user_uid,
          messageList,
        }) =>
          set(
            (state) => {
              if (state.messageListStore[to_user_uid]) {
                const messageIndex = state.messageListStore[
                  to_user_uid
                ].findIndex((message) => message.request_uid === request_uid);

                if (messageIndex !== -1) {
                  // eslint-disable-next-line prefer-destructuring
                  state.messageListStore[to_user_uid][messageIndex] =
                    messageList[0];
                }
              }
              if (!state.messageListStore[to_user_uid]) {
                state.messageListStore[to_user_uid] = [...messageList];
              }
            },
            false,
            'update loading message in chat'
          ),
        // обновление сообщения при ошибке
        setUpdatedErrorMessageFromSocket: ({
          request_uid,
          to_user_uid,
        }: {
          request_uid: string;
          to_user_uid: string;
        }) =>
          set(
            (state) => {
              if (state.messageListStore[to_user_uid]) {
                const messageIndex = state.messageListStore[
                  to_user_uid
                ].findIndex((message) => message.request_uid === request_uid);

                if (messageIndex !== -1) {
                  const message =
                    state.messageListStore[to_user_uid][messageIndex];
                  message.isLoading = false;
                  message.isError = true;
                }
              }
            },
            false,
            'update error message in chat'
          ),
        // метод для изменения сообщения
        updateMessage: (uid: string, messageId: number, newContent: string) =>
          set(
            (state) => {
              const chat = state.messageListStore[uid];
              if (chat) {
                const index = chat.findIndex(
                  (message) => message.id === messageId
                );
                if (index !== -1) {
                  chat[index] = {
                    ...chat[index],
                    content: newContent,
                  };
                } else {
                  console.error(
                    `Сообщение с id ${messageId} не найдено в чате с uid ${uid}.`
                  );
                }
              } else {
                console.error(`Чат с uid ${uid} не найден в хранилище.`);
              }
            },
            false,
            'update message in chat'
          ),
        updateStatusMessage: ({ uidUser, messageUid }) =>
          set(
            (state) => {
              const chat = state.messageListStore[uidUser];
              if (chat) {
                const index = chat.findIndex(
                  (message) => message.uid === messageUid
                );
                if (index !== -1) {
                  console.log(1);
                  chat[index] = {
                    ...chat[index],
                    new: false,
                  };
                } else {
                  console.error(
                    `Сообщение с id ${messageUid} не найдено в чате с uid ${uidUser}.`
                  );
                }
              } else {
                console.error(
                  `Чат с uidUser ${uidUser} не найден в хранилище.`
                );
              }
            },
            false,
            'update status message in chat'
          ),
        // метод для удаления сообщения
        deleteMessage: (
          uid: string,
          messageId: number | null,
          request_uid: string | null
        ) =>
          set(
            (state) => {
              const chat = state.messageListStore[uid];
              if (chat) {
                const index = chat.findIndex((message) => {
                  return (
                    (messageId !== null && message.id === messageId) ||
                    (request_uid !== null &&
                      message.request_uid === request_uid)
                  );
                });

                if (index !== -1) {
                  chat.splice(index, 1);
                } else {
                  console.error(
                    `Сообщение с id ${
                      messageId || request_uid
                    } не найдено в чате с uid ${uid}.`
                  );
                }
              } else {
                console.error(`Чат с uid ${uid} не найден в хранилище.`);
              }
            },
            false,
            'delete message in chat'
          ),
        deleteChat(uid) {
          set(
            (state) => {
              const chat = state.messageListStore[uid];
              if (chat) {
                delete state.messageListStore[uid];
              }
            },
            false,
            'delete all message'
          );
        },
        // проверка наличия чата в хранилище
        hasOwnProperty: (uid) => {
          const check = Boolean(get().messageListStore[uid]);
          return check;
        },

        // полная очистка хранилища
        clearStoreMessageList: () =>
          set(
            (state) => {
              state.messageListStore = {};
            },
            false,
            'clear message list store'
          ),
      }))
    ),

    {
      name: 'messageListStore',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useMessageListStore;
