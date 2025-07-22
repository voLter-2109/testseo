/* eslint-disable @typescript-eslint/naming-convention */

import Cookies from 'js-cookie';
import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { useNavigate } from 'react-router';

import { getNewTokens, setTokens } from '../api/apiService';
import { getChatsList } from '../api/chat/chat';
import { QKEY_GET_TEXT_MESSAGE } from '../constant/querykeyConstants';
import { ACCESS_TOKEN } from '../constant/token.constants';
import useNetwork from '../hooks/getNetworkConnection';
import usePlaySound from '../hooks/soundNotification';
import useChatListStore from '../store/chatListStore';
import useUserStore from '../store/userStore';
import { ChatsListItem, LastMessage } from '../types/chat/chat';
import { MessageListItem, MessagesList } from '../types/chat/messageListItem';
import {
  CHANGE_STATUS_READ_MESSAGE,
  ChangeStatusMessage,
  CREATE_CHAT,
  CREATE_TEXT_MESSAGE,
  CreateChannelPayload,
  CreateChannelResponse,
  DELETE_MESSAGE,
  DeleteMessageWS,
  ForLoadingMessageList,
  MessageWithSocket,
  NEW_STATUS_USER,
  NEW_STATUS_USER_ALL,
  ObjectCreateChannel,
  RequestChangeStatusMEssage,
  RequestCreateChannelGroup,
  RequestCreateSendMessage,
  RequestDeleteMessagesREf,
  RequestDeleteMEssageWS,
  RequestObject,
  RequestObjectOnlineStatus,
  RequestUpdateMessage,
  SendMessage,
  TChannels,
  THandleSendMessage,
  UPDATE_MESSAGE,
  UpdateMessage,
  WebSocketProps,
} from '../types/websoket/websoket.types';
import createLoadingMessageList from '../utils/chat/createLoadingMessageList';

export const WebSocketContext = createContext<WebSocketProps | null>(null);

const WebSocketComponent: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // текущий статус подключения сокетов
  const [status, setStatus] = useState<boolean>(false);
  // нужен для отображение tost что soket подключен,
  const accessToken = Cookies.get(ACCESS_TOKEN);

  // тут записывается сам сокет, что бы не потерять контекст
  const socketRef = useRef<WebSocket | null>(null);
  // тут записывается таймер для запроса статусов
  const timeIntervalRefForStatus = useRef<NodeJS.Timer | null>(null);
  // тут записывается таймер при обрыве связи
  const retryInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  // тут записываются ключи отправленных сообщений в качестве ключей requestId
  const requestCreateSendMessage = useRef<RequestCreateSendMessage>({});
  // тут записываются ключи  удаленных сообщений в качестве ключей requestId
  const requestDeleteMessages = useRef<RequestDeleteMessagesREf>({});
  // тут записываются ключи для создания групп или каналов
  const requestCreateGroupChannel = useRef<RequestCreateChannelGroup>({});

  // берем методы store chatList для изменения статусов online  и последнего сообщения в чате
  const {
    setOnlineStatusInUserList,
    setLastMessageOnChatByUserUid,
    checkChatListByUid,
    setTriggerChatArchive,
    setStoreChatList,
    changeUnreadQuantityMessage,
    getChatByUid,
    updateStatusCreating,
    getNextChatId,
  } = useChatListStore();
  // метод для записи в store с самими сообщениями последнего сообщения
  const { online } = useNetwork();
  const { user } = useUserStore((state) => state);

  const { playSoundNotFocus } = usePlaySound();

  const chatListStore = useChatListStore((state) => state.chatListStore);

  // react toast для всплывающих окон
  // const notifySuccess = (text: string) => toast.success(text);
  const notifyError = (text: string) => toast.error(text);

  const lastIndexBeforeUndefined = (oD: AxiosResponse<MessagesList, any>[]) => {
    if (oD.length === 1) return 0;

    for (let i = 0; i < oD?.length; i += 1) {
      if (oD[i] === undefined) {
        return i - 1;
      }
    }

    return oD.length - 1;
  };

  // * функция для обработки входящего запроса от сокета,  текстового / файлового сообщения
  const handlingTextMessage = async (request: MessageWithSocket) => {
    playSoundNotFocus();
    const {
      to_user,
      from_user,
      to_user_role,
      from_user_role,
      uid,
      id,
      forwarded_messages,
    } = request.object;

    const { request_uid: requestId } = request;
    // Определяем, кто является текущим пользователем
    const isSender = from_user.uid === user?.uid;
    const checkUserUid = isSender ? to_user.uid : from_user.uid;
    const checkUserRole = isSender ? to_user_role : from_user_role;
    const checkUserNickName = isSender ? to_user.nickname : from_user.nickname;

    // проверяем есть ли такой чат в нашем списке чатов
    const checkUserChat = checkChatListByUid(checkUserUid);

    // получаем кол-во сообщений в чате до обновления
    // const totalCount = getChatByUid(checkUserUid);

    // проверяем есть ли список сообщений в кеше и их кол-во
    const checkMessageListByUid = queryClient.getQueryData<
      InfiniteData<AxiosResponse<MessagesList>>
    >([QKEY_GET_TEXT_MESSAGE, checkUserUid]);
    // const { length: cashLength } =
    //   checkMessageListByUid?.pages.flatMap(
    //     (page) => page?.data?.results || []
    //   ) || [];

    // если есть формируем новое последнее сообщение для отображения в списке чатов
    const lastMes: LastMessage = {
      content:
        forwarded_messages.length > 0
          ? 'Пересланное сообщение'
          : request.object.content,
      from_user: checkUserUid,
      created_at: request.object.created_at,
      files_list: request.object.files_list,
      from_user_role: checkUserRole,
      id: request.object.id,
      new: request.object.new,
      uid: request.object.uid,
      updated_at: request.object.updated_at,
    };

    // у нас есть totalCount когда мы получаем новое сообщение
    // мы проверяем есть ли в кеше такое же кол-во сообщений
    // если кол-во в кеше сошлось с totalCount то мы добавляем сообщение
    // если не сошлось значит будет срабатывать пагинация

    // checkUserChat - проверка есть ли сам чат в сторе
    // isSender true если отправитель ты сам
    // checkMessageListByUid - проверка есть ли список сообщений в кеше

    // ! тут если ты isSender && !checkMessageListByUid && checkUserChat &&forwarded_messages.length >0

    // варинат для перепосланных сообщений, так как в данном варианте мы отправляем сообщения
    // сообщение в чат которого теоретически еще может не быть в кеше

    if (
      isSender &&
      !checkMessageListByUid &&
      checkUserChat &&
      forwarded_messages.length > 0
    ) {
      setLastMessageOnChatByUserUid({
        uid: checkUserUid,
        lastMessage: lastMes,
      });
    }

    if (checkUserChat && !isSender) {
      // если чат есть то обновляем кол-во непрочитанных сообщений
      // обновляем кол-во непрочитанных сообщений
      changeUnreadQuantityMessage({
        change: 'inc',
        uidChat: checkUserUid,
      });
      setLastMessageOnChatByUserUid({
        uid: checkUserUid,
        lastMessage: lastMes,
      });
    }

    // если список сообщений есть в кеше то обновляем
    if (checkMessageListByUid) {
      // обновляем последнее сообщение  и полное кол-во сообщений
      setLastMessageOnChatByUserUid({
        uid: checkUserUid,
        lastMessage: lastMes,
      });

      // если сообщение отправляли мы сами то только обновляем его статус загрузки
      if (isSender) {
        setTriggerChatArchive(checkUserUid);
        queryClient.setQueryData<InfiniteData<AxiosResponse<MessagesList>>>(
          [QKEY_GET_TEXT_MESSAGE, checkUserUid],
          (oldData) => {
            if (!oldData) return oldData;

            // ищем индекс сообщения из массива 99 и обновляем его статус
            const indexMessage = oldData.pages[99]?.data.results.findIndex(
              (item) => {
                return item.request_uid === requestId;
              }
            );

            if (indexMessage !== -1 && indexMessage !== undefined) {
              const oldPages = oldData.pages;

              // ! заменить id uid
              // создаем новое сообщение на основе старого и меняем статус загрузки
              const newMes: MessageListItem = {
                ...oldPages[99].data.results[indexMessage],
                isLoading: false,
                isError: false,
                created_at: request.object.created_at,
                uid,
                id,
              };

              // меняем в общем массиве, это сообщение на новое
              const updatedPage = {
                ...(oldPages[99] || {}),
                config: oldPages[99].config,
                data: {
                  count: oldPages[99].data.count || 0,
                  results: [
                    ...oldPages[99].data.results.slice(0, indexMessage),
                    newMes,
                    ...oldPages[99].data.results.slice(indexMessage + 1),
                  ],
                  next: oldPages[99].data.next || null,
                  previous: oldPages[99].data.previous || null,
                },
                headers: oldPages[99].headers,
                status: oldPages[99].status,
                statusText: oldPages[99].statusText,
              };

              const newPages = [...oldPages];
              newPages[99] = updatedPage;

              return {
                ...oldData,
                pages: newPages,
              };
            }

            // если такого сообщения нет, возвращаем старые данные
            return oldData;
          }
        );
      }

      // но если отправляли не мы и есть кеш сообщений
      // и общая длинна всех сообщений совпадает с кешем то добавляем новое сообщение
      // если списка сообщений в кеше нет, то при отрытии
      // чата будет использоваться логика загрузки чатов из компонента averageBlock

      if (
        !isSender
        // &&
        // totalCount &&
        // cashLength &&
        // totalCount.message_count === cashLength
      ) {
        // !
        queryClient.setQueryData<InfiniteData<AxiosResponse<MessagesList>>>(
          [QKEY_GET_TEXT_MESSAGE, checkUserUid],
          (oldData) => {
            if (!oldData) return oldData;

            const oldPages = oldData.pages;

            const index = lastIndexBeforeUndefined(oldPages);

            if (index !== -1 && oldPages[index].data.next) return oldData;

            const updatedPage = {
              ...(oldPages[99] || {}),
              config: oldPages[99]?.config,
              data: {
                count: oldPages[99]?.data.count || 0,
                results: [
                  ...(oldPages[99]?.data.results || []),
                  request.object,
                ],
                next: oldPages[99]?.data.next || null,
                previous: oldPages[99]?.data.previous || null,
              },
              headers: oldPages[99]?.headers,
              status: oldPages[99]?.status,
              statusText: oldPages[99]?.statusText,
            };

            const newPages = [...oldPages];
            newPages[99] = updatedPage;

            return {
              ...oldData,
              pages: newPages,
            };
          }
        );
      }
    }

    // если чат новый
    if (!checkUserChat) {
      try {
        getChatsList({
          search: checkUserNickName,
        })
          .then((res) => {
            if (res.data.results[0]) {
              setStoreChatList([res.data.results[0]]);

              if (checkMessageListByUid) {
                queryClient.setQueryData<
                  InfiniteData<AxiosResponse<MessagesList>>
                >([QKEY_GET_TEXT_MESSAGE, checkUserUid], (oldData) => {
                  if (!oldData) return oldData;

                  const oldPages = oldData.pages;
                  const updatedPage = {
                    ...(oldPages[99] || {}),
                    config: oldPages[99]?.config,
                    data: {
                      count: oldPages[99]?.data.count || 0,
                      results: [...[], request.object],
                      next: oldPages[99]?.data.next || null,
                      previous: oldPages[99]?.data.previous || null,
                    },
                    headers: oldPages[99]?.headers,
                    status: oldPages[99]?.status,
                    statusText: oldPages[99]?.statusText,
                  };

                  const newPages = [];
                  newPages[99] = updatedPage;

                  return {
                    pageParams: [1],
                    pages: newPages,
                  };
                });
              }
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } catch (error) {
        console.log(error);
      }

      // // получить пользователя из chat/list по nickname
    }
    // Дополнительная проверка если в запросе есть requestId, то удаляем из useRef
    if (requestId && requestCreateSendMessage.current[requestId]) {
      delete requestCreateSendMessage.current[requestId];
    }
  };

  // * функция для обработки входящего запроса от сокета,  связанного со сменой статуса юзера в сети он или нет
  const handlingOnlineStatus = (request: RequestObjectOnlineStatus) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention

    const isOnline = request.object?.is_online ?? false;
    const { user: userDataStatus, was_online_at } = request.object;

    if (!userDataStatus?.uid) return;

    setOnlineStatusInUserList({
      isOnline,
      uid: userDataStatus.uid,
      wasOnlineAt: was_online_at,
    });
  };

  // * функция связана со сменой статуса сообщения
  const handleChangeStatusMessage = (request: RequestChangeStatusMEssage) => {
    const {
      object: { uid, from_user, to_user },
    } = request;

    const isSender = from_user.uid === user?.uid;
    const checkUserUid = isSender ? to_user.uid : from_user.uid;

    queryClient.setQueryData<InfiniteData<AxiosResponse<MessagesList>>>(
      [QKEY_GET_TEXT_MESSAGE, checkUserUid],
      (oldData) => {
        if (!oldData) return oldData;

        const oldPages = oldData.pages;

        const updatedPages = oldPages.map((subArray) => {
          if (subArray && subArray.data) {
            return {
              ...subArray,
              data: {
                ...subArray.data,
                results: subArray.data.results.map((item) => {
                  if (item.uid === uid) {
                    return {
                      ...item,
                      new: false,
                    };
                  }
                  return item;
                }),
              },
            };
          }

          return subArray;
        });

        return {
          ...oldData,
          pages: updatedPages,
        };
      }
    );

    changeUnreadQuantityMessage({
      change: 'dec',
      uidChat: checkUserUid,
    });
  };

  const handlingUpdateMessage = (request: RequestUpdateMessage) => {
    const {
      object: { uid, content },
    } = request;

    const isSender = request.object.from_user.uid === user?.uid;
    const checkUserUid = isSender
      ? request.object.to_user.uid
      : request.object.from_user.uid;

    queryClient.setQueryData<InfiniteData<AxiosResponse<MessagesList>>>(
      [QKEY_GET_TEXT_MESSAGE, checkUserUid],
      (oldData) => {
        if (!oldData) {
          return oldData;
        }

        const oldPages = oldData.pages;
        let found = false;

        const updatedPages = oldPages.map((subArray) => {
          if (subArray && subArray.data) {
            const updatedMessages = subArray.data.results.map((item) => {
              if (item.uid === uid) {
                found = true;
                return { ...item, content };
              }
              return item;
            });

            if (found) {
              return {
                ...subArray,
                data: {
                  ...subArray.data,
                  results: updatedMessages,
                },
              };
            }
          }
          return subArray;
        });

        if (!found) {
          console.warn('Message with UID not found in cache');
        }

        return {
          ...oldData,
          pages: updatedPages,
        };
      }
    );
  };

  // ! функция вызывается когда сообщение удаляют
  const handlingDeleteMessage = (request: RequestDeleteMEssageWS) => {
    const {
      message: { uid: messageUid, from_user, to_user },
      request_uid: requestId,
    } = request;

    const isSender = from_user.uid === user?.uid;

    const chat = chatListStore.find(
      (item) => item.chat.uid === from_user.uid || item.chat.uid === to_user.uid
    );

    const chatUid = chat?.chat.uid;

    const exactLastMessage = getChatByUid(chatUid || '')?.last_message;

    const checkUserUid = isSender ? to_user.uid : from_user.uid;

    const checkMessageListByUid = queryClient.getQueryData<
      InfiniteData<AxiosResponse<MessagesList>>
    >([QKEY_GET_TEXT_MESSAGE, checkUserUid]);

    const forceDeleteMessage = (uidToDelete: string) => {
      queryClient.setQueryData<InfiniteData<AxiosResponse<MessagesList>>>(
        [QKEY_GET_TEXT_MESSAGE, uidToDelete],
        (oldData) => {
          if (!oldData) return oldData;

          const oldPages = oldData.pages;

          const updatedPages = oldPages.map((subArray) => {
            if (subArray && subArray.data) {
              const indexMessage = subArray.data.results.findIndex(
                (item) => item.uid === messageUid
              );

              if (indexMessage === -1) {
                return subArray;
              }
              const updatedResults = [...subArray.data.results];
              updatedResults[indexMessage] = {
                ...updatedResults[indexMessage],
                forwarded_messages: [],
                replied_messages: [],
                files_list: [],
                isError: false,
                isLoading: false,
                isDeleted: true,
              };

              return {
                ...subArray,
                data: {
                  ...subArray.data,
                  results: updatedResults,
                },
              };
            }

            return subArray;
          });

          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
    };
    if (checkMessageListByUid) {
      forceDeleteMessage(checkUserUid);
    }
    const handleNewLastPreviewedMessage = (
      destinationId: string,
      newLastMessage: LastMessage
    ) => {
      setLastMessageOnChatByUserUid({
        uid: destinationId,
        lastMessage: newLastMessage,
      });
    };

    if (requestId && requestDeleteMessages.current[requestId]) {
      delete requestCreateSendMessage.current[requestId];
    }

    if (exactLastMessage?.uid === messageUid) {
      handleNewLastPreviewedMessage(checkUserUid, {
        id: exactLastMessage.id,
        uid: exactLastMessage.uid,
        from_user: exactLastMessage.from_user,
        from_user_role: exactLastMessage.from_user_role,
        content: 'Сообщение удалено',
        files_list: [],
        new: false,
        created_at: exactLastMessage.created_at,
        updated_at: exactLastMessage.updated_at,
      });
    }
  };

  const handleCloseSocket = (): Promise<string> => {
    return new Promise((resolve) => {
      if (socketRef.current && socketRef.current.readyState === 1) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (retryInterval.current) {
        clearTimeout(retryInterval.current);
      }

      resolve('ok');
    });
  };

  const getNewToken = async () => {
    const { newAccessToken, newRefreshToken } = await getNewTokens();
    setTokens(newAccessToken, newRefreshToken);
  };

  const checkOnlineStatus = () => {
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN &&
      status
    ) {
      try {
        socketRef.current?.send(
          JSON.stringify({
            action: 'get_status_list_chat',
            request_uid: uuidv4(),
          })
        );
      } catch (error: any) {
        notifyError(error.message);
      }
    }
  };

  const handlingCreateChannels = (req: CreateChannelResponse) => {
    const {
      request_uid,
      message: {
        chat_key,
        chat_type,
        description,
        created_by,
        chat_avatar_url,
        name,
        owner_full_name,
      },
    } = req;

    if (req.status === 'error') {
      updateStatusCreating({
        status: req.status,
        error: req.error,
        action: req.action,
        request_uid: req.request_uid,
      });
      return `Ошибка при создании канала: ${req.error}`;
    }
    const uidFromKey = chat_key.split('_')[1];

    const formattedChat: ChatsListItem = {
      chat: {
        uid: uidFromKey,
        username: '',
        nickname: '',
        first_name: '',
        last_name: '',
        avatar: chat_avatar_url ? 'avatar' : null,
        avatar_url: chat_avatar_url,
        avatar_webp: null,
        avatar_webp_url: null,
        is_filled: true,
        additional_information: '',
        birthday: 0,
        is_blocked: false,
        is_online: false,
        patronymic: '',
        specialization: null,
        was_online_at: 0,
      },
      chat_key,
      id: getNextChatId(),
      chat_type,
      name,
      index: 0,
      is_active: true,
      is_favorite: false,
      file_count: 0,
      message_count: 0,
      new_message_count: 0,
      new_file_count: 0,
      last_message: null,
      last_seen_message: null,
      first_new_message: null,
      created_by,
      description,
      owner_full_name,
      participants: [],
    };

    setStoreChatList([formattedChat]);

    updateStatusCreating?.(null);

    if (request_uid && requestCreateGroupChannel.current[request_uid]) {
      delete requestCreateSendMessage.current[request_uid];

      navigate(`/${uidFromKey}`);

      updateStatusCreating({
        status: 'OK',
        error: undefined,
        action: 'create_chat',
        request_uid,
      });
    }
    return undefined;
  };

  // подключение сокетов
  useEffect(() => {
    const apiWS = process.env.REACT_APP_API_URL_WS;
    if (user !== null && online && apiWS) {
      const socketUrl = `${apiWS}?authorization=${accessToken}`;

      // Инициализация WebSocket
      socketRef.current = new WebSocket(socketUrl);

      // Событие при успешном подключении
      socketRef.current.onopen = () => {
        setStatus(true);
        clearTimeout(retryInterval.current as NodeJS.Timeout);
      };

      // Событие при ошибке
      socketRef.current.onerror = (error: Event) => {
        console.log(error);
        console.error('Ошибка WebSocket:', error);
      };

      // Событие при закрытии соединения
      socketRef.current.onclose = (event: CloseEvent) => {
        console.log('WebSocket соединение закрыто:', event);
        setStatus(false);
      };

      socketRef.current.onmessage = (event: MessageEvent) => {
        // сначала приводим к типу без message,
        // так как тело отличается в зависимости от action
        const request: RequestObject = JSON.parse(event.data);
        // обработка ошибки
        if (request.error || request.status === 'error') {
          const errorMessageMatch =
            typeof request.error === 'string' &&
            request.error.match(/'message': ErrorDetail\(string='([^']+)'/);
          const errorMessage =
            errorMessageMatch && errorMessageMatch[1]
              ? errorMessageMatch[1]
              : typeof request.error === 'string'
                ? request.error
                : 'Unknown error';

          if (errorMessage === 'bad token') {
            console.log(errorMessage);
            return handleCloseSocket().then(() => {
              getNewToken();
            });
          }

          if (request.action === CREATE_CHAT && request.status === 'error') {
            updateStatusCreating({
              status: request.status,
              error:
                typeof request.error === 'string'
                  ? request.error
                  : typeof request.error === 'object' &&
                      request.error !== null &&
                      'message' in request.error
                    ? (request.error as any).message
                    : 'Unknown error',
              action: request.action,
              request_uid: request.request_uid,
            });
          }

          if (
            errorMessage.includes(
              'заблокировал вас. Сообщение не может быть отправлено.'
            ) ||
            errorMessage.includes(
              'Разблокируйте его, чтобы отправить сообщение'
            ) ||
            errorMessage.includes('Нельзя пересылать сообщения из чужих чатов.')
          ) {
            if (
              request.request_uid &&
              Object.prototype.hasOwnProperty.call(request, 'request_uid')
            ) {
              const toUserUidWithError =
                requestCreateSendMessage.current[request.request_uid]?.sendMes
                  .object.to_user_uid;

              queryClient.setQueryData<
                InfiniteData<AxiosResponse<MessagesList>>
              >([QKEY_GET_TEXT_MESSAGE, toUserUidWithError], (oldData) => {
                if (!oldData) return oldData;

                const oldPages = oldData.pages;

                const newResult = oldPages[99]?.data.results.map((item) => {
                  if (item.request_uid === request.request_uid) {
                    return { ...item, isError: true, isLoading: false };
                  }

                  return item;
                });

                const updatedPage = {
                  ...(oldPages[99] || {}),
                  config: oldPages[99]?.config,
                  data: {
                    count: oldPages[99]?.data.count || 0,
                    results: [...newResult],
                    next: oldPages[99]?.data.next || null,
                    previous: oldPages[99]?.data.previous || null,
                  },
                  headers: oldPages[99]?.headers,
                  status: oldPages[99]?.status,
                  statusText: oldPages[99]?.statusText,
                };

                const newPages = [...oldPages];
                newPages[99] = updatedPage;

                return {
                  ...oldData,
                  pages: newPages,
                };
              });
            }

            return notifyError(errorMessage);
          }
          // ! tyt будут другие кейсы
          return notifyError(request?.error || 'Unkown error after all');
        }

        if (
          !Object.prototype.hasOwnProperty.call(request, 'action') ||
          !Object.prototype.hasOwnProperty.call(request, 'status')
        )
          return null;

        switch (request.action) {
          // ответ сокета при создании чата
          case CREATE_CHAT: {
            // положительный ответ
            if (request.status === 'OK') {
              return handlingCreateChannels(request as CreateChannelResponse);
            }
            break;
          }
          // ответ от сокета входящее сообщение
          // приводим request к типу RequestObjectChatMessage
          case CREATE_TEXT_MESSAGE: {
            if (request.status === 'OK') {
              return handlingTextMessage(request as MessageWithSocket);
            }
            break;
          }
          // Изменения статусов - action new_status_user , status ok
          // * action для самостоятельного запроса "action": "get_status_list_chat" запрос на получение статусов
          case NEW_STATUS_USER:
          case NEW_STATUS_USER_ALL: {
            if (request.status === 'OK') {
              return handlingOnlineStatus(request as RequestObjectOnlineStatus);
            }
            break;
          }
          // удаление сообщения
          case DELETE_MESSAGE: {
            if (request.status === 'OK') {
              return handlingDeleteMessage(request as RequestDeleteMEssageWS);
            }
            break;
          }
          // изменения статуса сообщения
          case CHANGE_STATUS_READ_MESSAGE: {
            if (request.status === 'OK') {
              return handleChangeStatusMessage(
                request as RequestChangeStatusMEssage
              );
            }
            break;
          }
          // редактирование уже имеющегося сообщения
          case UPDATE_MESSAGE: {
            if (request.status === 'OK' && 'object' in request) {
              return handlingUpdateMessage(request as RequestUpdateMessage);
            }
            break;
          }

          default:
            break;
        }
        return null;
      };
    }

    return () => {
      handleCloseSocket();
    };
  }, [user, online]);

  // * функция для отправки сообщения через сокеты
  const handleCreateTextMessage = ({
    type,
    chatKey,
    toUserUid,
    content,
    resetValue,
  }: THandleSendMessage): void => {
    const requestId = uuidv4();
    const isChat = type === TChannels.CHAT;
    const {
      fileBlob,
      textContent,
      repliedMEssage,
      filesForLoading,
      forwardedMessages: forward,
    } = content;

    // создает object for action
    const baseMessage = {
      content: textContent,
      files: fileBlob,
      status: 'publish',
      replied_messages: repliedMEssage.map((item) => item.id),
      forwarded_messages: forward.map((item) => item.id),
    };

    const sendMes = isChat
      ? { ...baseMessage, to_user_uid: toUserUid }
      : { ...baseMessage, chat_key: chatKey };

    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN &&
      status
    ) {
      // формируем сообщение
      const sendMessage: SendMessage = {
        action: CREATE_TEXT_MESSAGE,
        // @ts-ignore
        object: sendMes,
        request_uid: requestId,
      };

      // сохраняем сообщение в виде ключа
      requestCreateSendMessage.current = {
        [requestId]: {
          created_at: new Date().getTime(),
          sendMes: sendMessage,
          statusSend: true,
          filesForLoading,
        },
      };

      // try {
      if (user) {
        socketRef.current?.send(JSON.stringify(sendMessage));

        const chat = getChatByUid(toUserUid);
        // тут сохраняем копию а потом обновляем статус isLoading
        const forLoadingMessageList: ForLoadingMessageList = {
          content: textContent,
          files: filesForLoading,
          toUser: {
            firstName: chat ? chat.chat.first_name : '',
            lastName: chat ? chat.chat.last_name : '',
          },
          fromUser: {
            firstName: user.first_name,
            lastName: user.last_name,
          },
          uid: user.uid,
          to_user_uid: toUserUid,
          request_uid: requestId,
          loading: true,
          error: false,
          forward,
          repliedMEssage,
        };
        const messageList = createLoadingMessageList(forLoadingMessageList);

        // до отправки на сервер создаем копию сообщения в кеше и ставим статус загрузки true
        queryClient.setQueryData<InfiniteData<AxiosResponse<MessagesList>>>(
          [QKEY_GET_TEXT_MESSAGE, toUserUid],
          (oldData) => {
            if (!oldData) return oldData;

            const oldPages = oldData.pages;

            const index = lastIndexBeforeUndefined(oldPages);

            if (index !== -1 && oldPages[index].data.next) {
              return oldData;
            }

            const updatedPage = {
              ...(oldPages[99] || {}),
              config: oldPages[99]?.config,
              data: {
                count: oldPages[99]?.data.count || 0,
                results: [...(oldPages[99]?.data.results || []), messageList],
                next: null,
                previous: oldPages[99]?.data.previous || null,
              },
              headers: oldPages[99]?.headers,
              status: oldPages[99]?.status,
              statusText: oldPages[99]?.statusText,
            };
            const newPages = [...oldPages];
            newPages[99] = updatedPage;
            return {
              ...oldData,
              pages: newPages,
            };
          }
        );

        // // Показываем загрузку сообщения (isLoading === true)
        // setMessageFromSocket({ uid: toUserUid, messageList });
        if (resetValue) resetValue();
      }
      // } catch (error) {
      //   requestCreateSendMessage.current[requestId].statusSend = false;
      //   notifyError('Error sending message');
      // }
    } else {
      notifyError('вы не подключены');
    }
  };

  // * функция для отправки запроса на удаление сообщения
  const handleDeleteMessage = (message: MessageListItem) => {
    const requestId = uuidv4();

    requestDeleteMessages.current = {
      [requestId]: {
        message,
        request_uid: requestId,
      },
    };

    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN &&
      status
    ) {
      // формируем сообщение
      const actionDeleteMessage: DeleteMessageWS = {
        action: DELETE_MESSAGE,
        object: {
          id_or_uid: message.uid,
          for_all: true,
        },
        request_uid: requestId,
      };

      try {
        socketRef.current?.send(JSON.stringify(actionDeleteMessage));
      } catch (error: any) {
        notifyError(error.message);
      }
    }
  };

  useEffect(() => {
    // checkOnlineStatus();

    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN &&
      status
    ) {
      // запрос статусов
      timeIntervalRefForStatus.current = setInterval(() => {
        console.log(1);
        checkOnlineStatus();
      }, 300000);
    }

    return () => {
      clearInterval(timeIntervalRefForStatus.current as NodeJS.Timer);
      timeIntervalRefForStatus.current = null;
    };
  }, [
    socketRef.current,
    socketRef.current && socketRef.current.readyState,
    status,
  ]);

  // * функция для повторной отправки сообщения через сокеты
  const handleRepeatMessageSend = (requestUid: string) => {
    if (user) {
      socketRef.current?.send(
        JSON.stringify(requestCreateSendMessage.current[requestUid].sendMes)
      );
    }
  };

  // * функция для изменения статуса о прочтении сообщения
  const handleChangeStatusReadMessage = (uid: string) => {
    const requestId = uuidv4();
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN &&
      status
    ) {
      const changeStatusMessage: ChangeStatusMessage = {
        action: CHANGE_STATUS_READ_MESSAGE,
        object: {
          id_or_uid: uid,
          new_read_status: false,
        },
        request_uid: requestId,
      };

      try {
        socketRef.current?.send(JSON.stringify(changeStatusMessage));
      } catch (error: any) {
        notifyError(error.message);
      }
    }
  };

  const handleEditMessage = (message: MessageListItem, content: string) => {
    const requestId = uuidv4();
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      // ! можно так же добавлять фотографии
      const editMessage: UpdateMessage = {
        action: UPDATE_MESSAGE,
        request_uid: requestId,
        object: {
          to_user_uid: message.to_user.uid,
          id_or_uid: message.uid,
          content,
          status: 'publish',
        },
      };

      requestCreateSendMessage.current = {
        [requestId]: {
          created_at: new Date().getTime(),
          sendMes: editMessage,
          statusSend: true,
          filesForLoading: [],
        },
      };

      try {
        socketRef.current.send(JSON.stringify(editMessage));
      } catch (error: any) {
        notifyError(error.message);
      }
    }
  };

  // ! написать
  const handleCheckStatusOnlineUser = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log('check');
    }
  };

  // * функция для создания группы или канала
  const createChannel = (d: ObjectCreateChannel, createdUid: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket не подключён');
      return;
    }

    const requestId = uuidv4();
    const message: CreateChannelPayload = {
      action: CREATE_CHAT,
      request_uid: requestId,
      object: d,
    };

    socketRef.current.send(JSON.stringify(message));

    requestCreateGroupChannel.current = {
      [requestId]: {
        message: d,
        createdUid,
        request_uid: requestId,
      },
    };
  };

  const useMemoValue = useMemo(
    (): WebSocketProps => ({
      status,
      handleDeleteMessage,
      handleCreateTextMessage,
      handleRepeatMessageSend,
      handleCheckStatusOnlineUser,
      handleChangeStatusReadMessage,
      handleEditMessage,
      createChannel,
    }),
    [status]
  );
  return (
    <WebSocketContext.Provider value={useMemoValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketComponent;
