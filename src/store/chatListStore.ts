/* eslint-disable @typescript-eslint/naming-convention */

import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { ChatsListItem, LastMessage } from '../types/chat/chat';
import { UserList } from '../types/chat/userList';
import getUniqueAndSortedArray from '../utils/getUniqueAndSortedArray';
import { RequestObject } from '../types/websoket/websoket.types';

// ! задача userList похоже больше не нужен
interface IChatListProfileStore {
  chatListStore: ChatsListItem[] | [];
  triggerOpenChatArchive: {
    chatId: string;
    isActive: boolean;
    active_date: number;
  } | null;
  setTriggerChatArchive: (uid: string) => void;
  userList: Record<string, UserList>;
  addUserInList: ({
    uid,
    userData,
  }: {
    uid: string;
    userData: UserList;
  }) => void;
  resetChatAfterClear: (uidChat: number) => void;
  setLastMessageOnChatByUserUid: ({
    uid,
    lastMessage,
  }: {
    uid: string;
    lastMessage: LastMessage;
  }) => void;
  setOnlineStatusInUserList: ({
    uid,
    isOnline,
    wasOnlineAt,
  }: {
    uid: string;
    isOnline: boolean;
    wasOnlineAt: number;
  }) => void;
  clearStoreChatList: () => void;
  changeUnreadQuantityMessage: ({
    uidChat,
    change,
  }: {
    uidChat: string;
    change: 'dec' | 'inc';
  }) => void;
  checkChatListByUid: (uid: string) => boolean;
  getChatByUid: (uid: string) => ChatsListItem | null;
  changeLastSeMessage: (
    uiChat: string,
    { idMes, uidMes }: { idMes: number; uidMes: string }
  ) => void;
  checkUserListByUid: (uid: string) => boolean;
  checkBlockedByUid: (uid: string) => boolean;
  getOnlineStateByUserUid: (uid: string) => {
    isOnline: boolean;
    wasOnlineAt: number | null;
  };
  setDeleteChatById: ({ uid }: { uid: number }) => void;
  setFavoriteChatById: ({ uid }: { uid: number }) => void;
  setBlockedChatById: (uid: string) => void;
  setArchiveChatById: ({ uid }: { uid: number }) => void;
  setStoreChatList: (chatList: ChatsListItem[]) => void;

  updateStatusCreating: (reqObject: RequestObject | null) => void;
  creatingStatus: RequestObject | null;
  getNextChatId: () => number;
}

const initialChatListStore = {
  chatListStore: [],
  userList: {},
  loadingMessages: [],
  fetchDoctorList: false,
  triggerOpenChatArchive: null,
  creatingStatus: null,
};

const useChatListStore = create<IChatListProfileStore>()(
  persist(
    devtools(
      immer((set, get) => ({
        ...initialChatListStore,
        resetChatAfterClear: (idChat) => {
          set(
            (state) => {
              const indexChat = get().chatListStore.findIndex(
                (chat) => chat.id === idChat
              );

              if (indexChat !== -1) {
                state.chatListStore[indexChat] = {
                  ...state.chatListStore[indexChat],
                  message_count: 0,
                  file_count: 0,
                  new_message_count: 0,
                  new_file_count: 0,
                  last_message: null,
                  last_seen_message: null,
                  first_new_message: null,
                };

                const sortData = getUniqueAndSortedArray({
                  arr1: state.chatListStore,
                  sortKey1: 'last_message.created_at',
                  uniqueKey: 'id',
                  sortFavorite: true,
                });

                state.chatListStore = sortData;
              } else {
                console.log(`chat id ${idChat} not found`);
              }
            },
            false,
            'reset chat'
          );
        },
        setTriggerChatArchive: (uid) => {
          set(
            (state) => {
              const indexChat = get().chatListStore.findIndex(
                (chat) => chat.chat.uid === uid
              );

              state.triggerOpenChatArchive = {
                chatId: uid,
                isActive:
                  indexChat !== -1
                    ? state.chatListStore[indexChat].is_active
                    : true,
                active_date: new Date().getTime(),
              };
            },
            false,
            'setTrigger archive chat'
          );
        },
        // добавить чат в список
        setStoreChatList: (chatList) =>
          set(
            (state) => {
              const prevList = state.chatListStore;
              chatList.forEach((item) => {
                let checkDoctor = false;

                const { specialization } = item.chat;
                const { participants, owner_full_name, name, description } =
                  item;

                if (
                  specialization !== null &&
                  Array.isArray(specialization) &&
                  specialization.length > 0
                ) {
                  checkDoctor = true;
                }

                state.userList[item.chat.uid] = {
                  ...item.chat,
                  // ...item,
                  username: item.name,
                  chat_type: item.chat_type,
                  is_doctor: checkDoctor,
                  // _______инфо по доктору
                  // ________есть в ответе списка чатов
                  specialization,
                  // ________нет в ответе списка чатов
                  scientific_degree_label: '',
                  work_place: '',
                  academy_label: '',
                  about_me: '',
                  work_experience_years: 0,
                  // ________инфо по чату
                  // _________есть в списке чатов
                  participants,
                  owner_full_name,
                  name,
                  description,
                };
              });

              const sortData = getUniqueAndSortedArray({
                arr1: chatList,
                sortKey1: 'last_message.created_at',
                uniqueKey: 'id',
                arr2: prevList,
                sortFavorite: true,
              });

              state.chatListStore = sortData;
            },
            false,
            'set chat list store'
          ),
        // список юзеров из чатов что бы подтягивать имя
        addUserInList: ({ uid, userData }) => {
          set(
            (state) => {
              const { userList } = state;
              console.log(1);

              if (Object.prototype.hasOwnProperty.call(userList, uid)) {
                userList[uid] = {
                  ...userList[uid],
                  ...userData,
                };
              } else userList[uid] = userData;
            },
            false,
            'add user in list'
          );
        },
        checkChatListByUid: (uid) => {
          const indexChat = get().chatListStore.findIndex(
            (user) => user.chat.uid === uid
          );

          return indexChat !== -1; // true, если чат существует
        },
        changeLastSeMessage: (uidChat, { idMes, uidMes }) => {
          set(
            (state) => {
              const indexChat = get().chatListStore.findIndex(
                (user) => user.chat.uid === uidChat
              );

              if (indexChat !== -1) {
                state.chatListStore[indexChat].last_seen_message = {
                  id: idMes,
                  uid: uidMes,
                };
              }
            },
            false,
            'change last se message'
          );
        },
        changeUnreadQuantityMessage: ({ change, uidChat }) => {
          set(
            (state) => {
              const indexChat = get().chatListStore.findIndex(
                (user) => user.chat.uid === uidChat
              );

              if (
                indexChat !== -1 &&
                change === 'dec' &&
                state.chatListStore[indexChat].new_message_count > 0
              ) {
                state.chatListStore[indexChat].new_message_count -= 1;
              }

              if (indexChat !== -1 && change === 'inc') {
                console.log('tyt');
                state.chatListStore[indexChat].new_message_count += 1;
              }
            },
            false,
            'change unread quantity message'
          );
        },
        checkUserListByUid: (uid) => {
          const { userList } = get();
          return Object.prototype.hasOwnProperty.call(userList, uid);
        },
        checkBlockedByUid: (uid) => {
          const indexChat = get().chatListStore.findIndex(
            (user) => user.chat.uid === uid
          );
          if (indexChat !== -1) {
            const isBlocked = get().chatListStore[indexChat].chat.is_blocked;
            return isBlocked;
          }
          return false;
        },
        // записать новое последнее сообщение
        setLastMessageOnChatByUserUid: ({ lastMessage, uid }) => {
          set(
            (state) => {
              const indexChat = state.chatListStore.findIndex(
                (user) => user.chat.uid === uid
              );
              if (indexChat !== -1) {
                state.chatListStore[indexChat] = {
                  ...state.chatListStore[indexChat],
                  last_message: lastMessage,
                  message_count:
                    state.chatListStore[indexChat].message_count + 1,
                };

                const sortData = getUniqueAndSortedArray({
                  arr1: state.chatListStore,
                  sortKey1: 'last_message.created_at',
                  uniqueKey: 'id',
                  sortFavorite: true,
                });

                state.chatListStore = sortData;
              }
            },
            false,
            'set last message on chat by user uid'
          );
        },
        // изменение статуса
        setOnlineStatusInUserList: ({ isOnline, uid, wasOnlineAt }) => {
          const indexChat = get().chatListStore.findIndex(
            (chat) => chat.chat.uid === uid
          );

          set(
            (state) => {
              if (indexChat !== -1) {
                state.chatListStore[indexChat].chat.is_online = isOnline;
                state.chatListStore[indexChat].chat.was_online_at = wasOnlineAt;
              }
            },
            false,
            'set online status in user list'
          );
        },
        // получить текущий статус
        getOnlineStateByUserUid: (uid) => {
          const chat = get().chatListStore.find((item) => {
            return item.chat.uid === uid;
          });

          if (chat) {
            return {
              isOnline: chat.chat.is_online,
              wasOnlineAt: chat.chat.was_online_at,
            };
          }

          return {
            isOnline: false,
            wasOnlineAt: null,
          };
        },
        getChatByUid: (uid) => {
          const indexChat = get().chatListStore.findIndex(
            (chat) => chat.chat.uid === uid
          );

          return indexChat !== -1 ? get().chatListStore[indexChat] : null;
        },
        // удалить чат из списка
        setDeleteChatById: ({ uid }) => {
          set(
            (state) => {
              const indexChat = state.chatListStore.findIndex(
                (chat) => chat.id === uid
              );
              console.log(indexChat);

              if (indexChat !== -1) {
                console.log(indexChat);
                state.chatListStore.splice(indexChat, 1);
              }
            },
            false,
            'delete chat by id'
          );
        },
        // favorite chat
        setFavoriteChatById: ({ uid }) => {
          const indexChat = get().chatListStore.findIndex(
            (chat) => chat.id === uid
          );
          let change = false;
          set(
            (state) => {
              if (indexChat !== -1) {
                state.chatListStore[indexChat].is_favorite =
                  !state.chatListStore[indexChat].is_favorite;
                change = true;
              }

              if (change) {
                const sortData = getUniqueAndSortedArray({
                  arr1: state.chatListStore,
                  sortKey1: 'last_message.created_at',
                  uniqueKey: 'id',
                  sortFavorite: true,
                });

                state.chatListStore = sortData;
              }
            },
            false,
            'toggle favorite chat by id'
          );
        },

        // blocked chat
        setBlockedChatById: (uid) => {
          const indexChat = get().chatListStore.findIndex(
            (item) => item.chat.uid === uid
          );
          set(
            (state) => {
              if (indexChat !== -1) {
                state.chatListStore[indexChat].chat.is_blocked =
                  !state.chatListStore[indexChat].chat.is_blocked;
              }
            },
            false,
            'toggle blocked chat by id'
          );
        },

        // archive chat
        setArchiveChatById: ({ uid }) => {
          const indexChat = get().chatListStore.findIndex(
            (chat) => chat.id === uid
          );
          set(
            (state) => {
              if (indexChat !== -1) {
                state.chatListStore[indexChat].is_active =
                  !state.chatListStore[indexChat].is_active;
              }
            },
            false,
            'toggle archive chat by id'
          );
        },

        // установить ошибку
        updateStatusCreating: (reqObject) => {
          set(
            (state) => {
              state.creatingStatus = reqObject;
            },
            false,
            'updating status'
          );
        },

        // получить cвободный индекс
        getNextChatId: () => {
          const list = get().chatListStore;
          if (list.length === 0) return 0;

          return Math.max(...list.map((chat) => chat.id)) + 1;
        },

        // очистить store
        clearStoreChatList: () =>
          set(
            (state) => {
              state.chatListStore = [];
              state.userList = {};
            },
            false,
            'clear chat list store'
          ),
      }))
    ),

    {
      name: 'chatListStore',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useChatListStore;
