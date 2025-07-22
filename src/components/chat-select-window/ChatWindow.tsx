/* eslint-disable @typescript-eslint/naming-convention */
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useShallow } from 'zustand/react/shallow';

import { getDoctorsByUid } from '../../api/doctor/doctors';
import {
  QKEY_GET_DOCTOR_BY_UID,
  QKEY_GET_TEXT_MESSAGE,
  QKEY_GET_TEXT_MESSAGE_WITH_SEARCH,
} from '../../constant/querykeyConstants';

import useChatListStore from '../../store/chatListStore';

import Popup from '../../ui/popup/Popup';
import Forward from '../../ui/re-send-item-user/Forward';

import { MessageListItem } from '../../types/chat/messageListItem';

import OutletLoading from '../../ui/suspense-loading/OutletLoading';

import BlacklistPopup from '../popups/blacklist-popup/BlacklistPopup';

import { getPositionMessage, getTextMessagesList } from '../../api/chat/chat';
import { MAX_CHATS_PER_PAGE } from '../../constant/filterParams';

import RootBoundaryComponent from '../../ui/error-component/RootBoundaryComponent';

import useUserStore from '../../store/userStore';

import SearchMessageItem from '../message-item/seach-message-item/SearchMessageItem';

import CrossBtn from '../../ui/cross-button/CrossBtn';

import { TChannels } from '../../types/websoket/websoket.types';

import AverageBlock from './average-block/AverageBlock';
import BottomBar from './bottom-bar/BottomBar';
import InformationBlock from './informationBlock.tsx/InformationBlock';
import TopBarChat from './top-bar/TopBarChat';

import EditMessagePopup from './edit-message-popup/EditMessagePopup';

import style from './chatWindow.module.scss';

interface Props {
  uid: string | null;
}

const ChatWindow: FC<Props> = ({ uid }) => {
  const queryClient = useQueryClient();
  const user = useUserStore(useShallow((state) => state.user));

  // отвечает за отображения информации по врачу при нажатии на имя собеседника
  const [isOpenInformationPanel, setIsOpenInformationPanel] =
    useState<boolean>(false);
  // отвечает за popup со списком чатов кому можно переслать сообщения
  const [isOpenForwardPopup, setIsOpenForwardPopup] = useState(false);
  // отвечает за popup с окном редактирования сообщения
  const [editingMessage, setEditingMessage] = useState<MessageListItem | null>(
    null
  );
  // список сообщений которые выбираются при нажатии на кнопку "выбрать"
  const [selectedMessagesForward, setSelectedMessagesForward] = useState<
    MessageListItem[]
  >([]);
  // список сообщений которые выбираются при нажатии на кнопку "переслать"
  const [selectMessage, setSelectMessage] = useState<MessageListItem[] | null>(
    null
  );
  // выбранное сообщение при нажатии  кнопку ответить
  const [selectRepliedMes, setSelectRepliedMes] =
    useState<MessageListItem | null>(null);

  // это то сообщение к которому должен проскролиться чат, нужен что бы его подсветить
  const [clickUidRepliedMesToScroll, setClickUidRepliedMesToScroll] = useState<
    string | null
  >(null);

  // значение в поле поиска
  const [searchValue, setSearchValue] = useState<string>('');
  // значение uid выбранного сообщения в поле поиска
  const [clickSearchMes, setClickSearchMes] = useState<string | null>(null);
  // enableQuerySearchMessage нужно для создания задержки при наборе символов в поле поиска
  const [enableSearchMes, setEnableSearchMes] = useState<boolean>(false);
  // отвечает за popup с окном черного списка
  const [openBlackList, setOpenBlackList] = useState<boolean>(false);

  // ! получить данные собеседника, проверить врач ли он (работает не всегда)
  // если да, то делаем запрос на получение информации о враче
  const getChatByUid = useChatListStore((state) => state.getChatByUid);
  const exactChat = getChatByUid(uid as string);

  const isGroupOrChat =
    exactChat?.chat_type === TChannels.CHAT ||
    exactChat?.chat_type === TChannels.PUBLIC_GROUP ||
    exactChat?.chat_type === TChannels.PRIVATE_GROUP;

  const isChannel =
    exactChat?.chat_type === TChannels.PUBLIC_CHANNEL ||
    exactChat?.chat_type === TChannels.PRIVATE_CHANNEL;

  console.log({ exactChat }, { uid });

  const isNewChat = exactChat === null && uid;

  const isAllowedToWrite =
    isGroupOrChat ||
    (isChannel && user?.uid === exactChat?.created_by) ||
    isNewChat;

  // ______________
  const addUserInList = useChatListStore((state) => state.addUserInList);
  const userList = useChatListStore((state) => state.userList);
  // сейчас мы делам запрос на контакт в каждом чате, а там есть отметка доктор он или нет
  const checkIsDoctor = useChatListStore((state) => {
    if (uid && state.userList[uid]) {
      return state.userList[uid].is_doctor;
    }

    return false;
  });

  // // если чата в памяти нет, то в других компонентах делает запрос на получение его контактов
  // const checkContactByUid = queryClient.getQueryData<
  //   AxiosResponse<ContactShortUserInfo>
  // >([GET_USER_BY_UID, uid]);

  // проверка что чат не заблокирован с нашей стороны
  const blockChat = useChatListStore((state) => {
    if (uid) {
      const index = state.chatListStore.findIndex((item) => {
        return item.chat.uid === uid;
      });

      return index !== -1 && state.chatListStore[index].chat.is_blocked;
    }

    return true;
  });

  // функция которая вызывает оповещения об ошибках
  const notifyError = (text: string) => toast.error(text);

  // *_______________функции__________________
  // выбор сообщения к которому необходимо совершить скролл
  const handleSetClickRepliedMes = (uidM: string) => {
    setClickUidRepliedMesToScroll(uidM);
  };

  // сброс сообщения к которому необходимо совершить скролл
  const resetClickRepliedMes = () => {
    setClickUidRepliedMesToScroll(null);
  };
  // выбрать сообщение при нажатии  кнопку ответить
  const handleSelectRepliedMes = (m: MessageListItem) => {
    setSelectRepliedMes(m);
  };
  // сброс выбранного сообщение при нажатии  кнопку ответить
  const resetSelectRepliedMes = () => {
    setSelectRepliedMes(null);
  };

  // открыть popup со списком чатов для пересылки
  const handleOpenForwardPopup = () => {
    setIsOpenForwardPopup(true);
  };

  // открыть popup с черным списком
  const handleOpeBlackList = () => {
    setOpenBlackList(true);
  };
  // закрыть popup с черным списком
  const handleCloseBlackList = () => {
    setOpenBlackList(false);
  };

  // сброс стейтов при выборе сообщения на кнопки "ответить", "переслать"
  const resetSelectMes = () => {
    setSelectedMessagesForward([]);
    setSelectMessage(null);
    setSelectRepliedMes(null);
  };

  // закрыть popup со списком чатов для пересылки
  const handleCloseForwardPopup = () => {
    setIsOpenForwardPopup(false);
    resetSelectMes();
  };

  // функция для выбора единичного сообщения для пересылки, кнопка "переслать"
  const handleChangeSelectMessage = (m: MessageListItem) => {
    if (m) {
      setSelectMessage([m]);
      handleOpenForwardPopup();
    }
  };

  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [updatedFileList, setUpdatedFileList] = useState<FileList | File[]>([]);

  // toggle на боковое меню с просмотром врача и медиа
  const handleToggleInfInformationPanel = () => {
    setIsOpenInformationPanel((prev) => !prev);
  };

  //  обработка списка сообщений  при нажатии на кнопку "выбрать" (квадратики слева от сообщений)
  const toggleMessageSelectionForward = (fMes: MessageListItem) => {
    const { id } = fMes;

    setSelectedMessagesForward((prevState) => {
      if (prevState === null) {
        return [fMes]; // если массив пустой, создаем новый с этим id
      }

      const index = prevState.findIndex((item) => {
        return item.id === id;
      });

      if (index !== -1 && index !== undefined) {
        // если id уже есть, удаляем его
        return prevState.filter((mes) => mes.id !== id);
      }

      if (prevState.length === 5) {
        notifyError('Ограничение 5 сообщений');
        return prevState;
      }
      // если id нет, добавляем его
      return [...prevState, fMes];
    });
  };

  // переменная которая работает как триггер для useQuery при загрузке данных врача
  const enableDoctorQuery = useMemo(() => {
    const t = (uid && checkIsDoctor) || false;

    return t;
  }, [checkIsDoctor && uid]);

  // функция для поиска сообщений при поиске
  const fetchTextMessage = useCallback(
    (uidInterlocutor: string, pageInt: number, searchV: string) => {
      return getTextMessagesList(uidInterlocutor, {
        page: pageInt,
        page_size: MAX_CHATS_PER_PAGE,
        ordering: 'created_at',
        search: searchV,
      });
    },
    [getTextMessagesList]
  );

  useEffect(
    () => console.log('enableDoctorQuery', enableDoctorQuery),
    [enableDoctorQuery]
  );

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current += 1;
      if (e.dataTransfer?.types.includes('Files')) {
        setIsDragging(true);
      }
    };
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        setIsDragging(false);
        dragCounter.current = 0;
      }
    };
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);
      if (e.dataTransfer) {
        setUpdatedFileList(e.dataTransfer?.files);
      }
    };
    const node = containerRef.current;
    if (node) {
      node.addEventListener('dragenter', handleDragEnter);
      node.addEventListener('dragleave', handleDragLeave);
      node.addEventListener('dragover', handleDragOver);
      node.addEventListener('drop', handleDrop);
    }
    return () => {
      if (node) {
        node.removeEventListener('dragenter', handleDragEnter);
        node.removeEventListener('dragleave', handleDragLeave);
        node.removeEventListener('dragover', handleDragOver);
        node.removeEventListener('drop', handleDrop);
      }
    };
  }, []);

  // *_______________useQuery__________________
  // запрос на получение данных врача, если enableDoctorQuery true
  const {
    data: doctorDataByUid,
    refetch: refetchDoctorByUid,
    isError: isErrorDoctorByUid,
    isLoading: isLoadingDoctorByUid,
    isFetching: isFetchingDoctorByUid,
  } = useQuery({
    queryKey: [QKEY_GET_DOCTOR_BY_UID, { uid }],
    queryFn: () => {
      if (uid) {
        return getDoctorsByUid(uid);
      }
      return undefined;
    },
    select: (data) => {
      return data?.data;
    },
    enabled: enableDoctorQuery,
    retry: false,
  });

  // если пошел запрос на доктора то обновить данные userList
  // далее userList использовать в informationBlock
  useEffect(() => {
    if (!isLoadingDoctorByUid && doctorDataByUid && uid) {
      addUserInList({
        uid,
        userData: { ...userList[uid], ...doctorDataByUid },
      });
    }
  }, [doctorDataByUid, isLoadingDoctorByUid, uid]);

  const {
    data: searchMessage,
    isLoading: isLoadingSearchMes,
    isError: isErrorSearchMes,
  } = useInfiniteQuery({
    queryKey: [QKEY_GET_TEXT_MESSAGE_WITH_SEARCH],
    queryFn: ({ pageParam }) => {
      if (uid && searchValue) {
        return fetchTextMessage(uid, pageParam, searchValue);
      }

      return null;
    },
    getNextPageParam: (lastPage) => {
      if (
        lastPage &&
        lastPage.data.next &&
        lastPage.data.next.indexOf('page=') !== -1
      ) {
        const next = parseInt(lastPage.data.next.split('page=')[1], 10);
        return next;
      }
      return null;
    },
    enabled: enableSearchMes,
    initialPageParam: 1,
  });

  // когда сообщения найдены, строим из них массив
  const allRowsSearchMes = useMemo(() => {
    return (
      searchMessage?.pages.flatMap((page) => page?.data?.results || []) ?? []
    );
  }, [searchMessage]);

  // сброс и повтоная загрука  данных на информацию по врачу, если придет ошибка во время запроса
  const handleREfetchDoctorByUid = () => {
    refetchDoctorByUid();
  };

  // * ___________________работа со скролом \ сбросом useQuery______________
  // сброс положения скролла
  const resetScrollOnChat = useCallback(
    (uidChat: string) => {
      sessionStorage.removeItem(`virtualizer_measurementsCache_${uidChat}`);
      sessionStorage.removeItem(`virtualizer_scrollOffset_${uidChat}`);
    },
    [sessionStorage]
  );

  // сброс данные по поиску сообщений
  const resetSearchMes = useCallback(() => {
    queryClient.removeQueries({
      queryKey: [QKEY_GET_TEXT_MESSAGE_WITH_SEARCH],
    });
  }, [queryClient]);

  // сброс сообщений из самого чата
  const resetChatMes = useCallback(
    (uidREsetChat: string) => {
      queryClient.removeQueries({
        queryKey: [QKEY_GET_TEXT_MESSAGE, uidREsetChat],
      });
    },
    [queryClient]
  );

  // при изменении критериев поиска, сбрасываем текущие значения и повторяем запрос
  // напрямую эту функцию не используем
  const debouncedInvalidateQueries = useCallback(
    debounce(() => {
      setEnableSearchMes(true);
      resetSearchMes();
    }, 500),
    [resetSearchMes]
  );

  // когда пользователь меняет значение поиска, останавливаем текущие запросы и повторяем запрос
  const handleSetSearchParams = useCallback((value: string) => {
    setEnableSearchMes(false);
    debouncedInvalidateQueries.cancel();
    setSearchValue(value);
    debouncedInvalidateQueries();
  }, []);

  // сброс поиска
  const resetSearchParams = useCallback(() => {
    setEnableSearchMes(false);
    debouncedInvalidateQueries.cancel();
    setSearchValue('');
    resetSearchMes();
  }, []);

  // функция вызывается когда пользователь нажал на один из результатов поиска
  const handleClickSearchMessage = useCallback(
    (value: string) => {
      if (uid) {
        Promise.all([
          handleSetClickRepliedMes(value),
          resetChatMes(uid),
          resetScrollOnChat(uid),
          setClickSearchMes(value),
          debouncedInvalidateQueries.cancel(),
          setSearchValue(''),
        ]);
      }
    },
    [setClickSearchMes, setSearchValue, resetChatMes, resetScrollOnChat, uid]
  );

  // ____________________TOTAL RESET__________________________
  // сброс стейтов
  const resetStateChat = useCallback(() => {
    debouncedInvalidateQueries.cancel();
    setClickSearchMes(null);
    resetSearchParams();
    resetClickRepliedMes();
    resetSelectRepliedMes();
    resetSelectMes();
  }, [
    setClickSearchMes,
    resetSearchParams,
    resetClickRepliedMes,
    resetSelectRepliedMes,
    resetSelectMes,
    debouncedInvalidateQueries,
  ]);
  // сброс загруженных данных и скрола
  const resetGlobalStateChat = useCallback(() => {
    debouncedInvalidateQueries.cancel();
    if (uid) {
      resetScrollOnChat(uid);
      resetSearchMes();
      resetChatMes(uid);
    }
  }, [
    uid,
    debouncedInvalidateQueries,
    resetScrollOnChat,
    resetSearchMes,
    resetChatMes,
  ]);
  // полный сброс окна чата
  const resetAll = useCallback(() => {
    resetStateChat();
    resetGlobalStateChat();
  }, [resetStateChat, resetGlobalStateChat]);

  // при смене uid чата поиск очищается и останавливается текущие запросы
  useEffect(() => {
    resetStateChat();
  }, [uid]);

  // _______________________________________________
  // сначала смотрим что у нас есть в сторе в информации о последних сообщениях
  const checkChatInStore = useChatListStore((state) => {
    if (uid) {
      const index = state.chatListStore.findIndex((item) => {
        return item.chat.uid === uid;
      });

      if (index !== -1) {
        const { first_new_message, last_message } = state.chatListStore[index];

        if (first_new_message) {
          return {
            uid: first_new_message.uid,
            type: 'new',
          };
        }

        if (last_message) {
          return {
            uid: last_message.uid,
            type: 'last',
          };
        }
      }
    }

    return null;
  });

  // потом смотрим есть ли у нас выбранное сообщение во время поиска
  const checkSearchMessage = useMemo(() => {
    if (clickSearchMes && uid) {
      return {
        uid: clickSearchMes,
        type: 'last',
      };
    }

    return null;
  }, [clickSearchMes, uid]);

  // ! сюда надо будет перенести логику с NavLink state, который используется в avarageBlock, как
  // ! критерий что было выбрано сообщения из поиска в левом меню

  // затем мы проверяем, если checkSearchMessage !== null,
  // то мы используем его, если нет то checkChatInStore

  const checkLastUidMessage = useMemo(() => {
    if (checkSearchMessage) return checkSearchMessage;
    return checkChatInStore;
  }, [checkSearchMessage, uid]);

  // далее мы ищем позицию последнего сообщения, при условии что у нас есть checkLastUidMessage
  // если checkLastUidMessage === null, то запрос делать не нужно

  const {
    data: dataGetLastMes,
    isSuccess: successLoadingLastMes,
    isLoading: isLoadingLastMes,
  } = useQuery({
    queryKey: [
      'get position first view message',
      uid,
      checkLastUidMessage?.uid,
    ],
    queryFn: () => {
      if (uid && checkLastUidMessage && checkLastUidMessage.uid) {
        return getPositionMessage(uid, 'created_at', {
          chatPageSize: MAX_CHATS_PER_PAGE,
          field: 'id_or_uid',
          query: checkLastUidMessage.uid,
        });
      }

      return null;
    },
    enabled: Boolean(checkLastUidMessage && checkLastUidMessage.uid && uid),
  });

  // сoздаем переменную с информацией о initialScrollMEssage
  const positionInitialMes = useMemo(() => {
    if (
      !isLoadingLastMes &&
      successLoadingLastMes &&
      dataGetLastMes &&
      dataGetLastMes.data[0].position
    )
      return dataGetLastMes.data[0].position;

    return null;
  }, [
    successLoadingLastMes,
    isLoadingLastMes,
    dataGetLastMes && dataGetLastMes.data[0].position,
  ]);

  // далее мы создаем переменную которая показывает с чего начинать загрузку самих сообщений

  const checkEnableForLoadingMessageInfiniteQuery = useMemo(() => {
    if (checkLastUidMessage === null) {
      return {
        enabled: true,
        initialPage: 1,
      };
    }
    // Если ты передаешь в enabled значение false, запрос не будет выполнен автоматически.

    if (
      successLoadingLastMes &&
      !isLoadingLastMes &&
      dataGetLastMes &&
      dataGetLastMes.data[0] &&
      dataGetLastMes.data[0].page
    ) {
      return {
        enabled: true,
        initialPage: dataGetLastMes.data[0].page,
      };
    }

    return {
      enabled: false,
      initialPage: 0,
    };
  }, [
    successLoadingLastMes,
    isLoadingLastMes,
    dataGetLastMes,
    checkLastUidMessage && checkLastUidMessage.uid,
  ]);

  const companion = useMemo(
    () => (uid ? userList[uid] : null),
    [uid, userList]
  );

  const isChat = useMemo(() => {
    if (companion && companion.chat_type === TChannels.CHAT) return true;
    return false;
  }, [companion]);

  return (
    <div className={style.chat} ref={containerRef}>
      {isDragging && (
        <div className={style.dragOverlay}>
          <div className={style.dragOverlayText}>Перетащите файлы сюда</div>
        </div>
      )}
      <>
        {uid ? (
          <div className={classNames(style.chatWindow)} id="chatWindow">
            <TopBarChat
              uid={uid}
              isDoctor={checkIsDoctor}
              valueInputSearch={searchValue}
              resetSearchParams={resetSearchParams}
              selectedMes={selectedMessagesForward}
              setValueInputSearch={handleSetSearchParams}
              resetSelectMesForward={resetSelectMes}
              handleOpenInf={handleToggleInfInformationPanel}
              isModeratedDoctor={
                !!(doctorDataByUid && doctorDataByUid.is_moderated)
              }
            />
            <div className={style.averageBlock}>
              {isLoadingLastMes ? (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  Загрузка...
                </div>
              ) : (
                <AverageBlock
                  positionInitialMes={positionInitialMes}
                  key={uid}
                  uid={uid}
                  handleClickSearchMessage={handleClickSearchMessage}
                  clickUidRepliedMesToScroll={clickUidRepliedMesToScroll}
                  handleSetClickRepliedMes={handleSetClickRepliedMes}
                  resetClickRepliedMes={resetClickRepliedMes}
                  checkLastUidMessage={checkLastUidMessage}
                  checkEnableForLoadingMessageInfiniteQuery={
                    checkEnableForLoadingMessageInfiniteQuery
                  }
                  selectRepliedMes={selectRepliedMes}
                  setSelectRepliedMes={handleSelectRepliedMes}
                  resetSelectRepliedMes={resetSelectRepliedMes}
                  blockChat={blockChat}
                  setEditingMessage={setEditingMessage}
                  handleRefreshChat={resetAll}
                  selectedMessagesForward={selectedMessagesForward}
                  handleChangeSelectMessage={handleChangeSelectMessage}
                  toggleMessageSelectionForward={toggleMessageSelectionForward}
                  handleOpeBlackList={handleOpeBlackList}
                />
              )}

              <div
                className={classNames(style.searchMessage, {
                  [style.searchMesOpen]: Boolean(searchValue),
                })}
              >
                {isLoadingSearchMes && <OutletLoading />}
                {isErrorSearchMes && (
                  <RootBoundaryComponent
                    isLoading={isLoadingSearchMes}
                    refreshFunc={debouncedInvalidateQueries}
                  />
                )}
                {allRowsSearchMes.length && user ? (
                  <ul>
                    {allRowsSearchMes.map((i) => {
                      return (
                        <li key={i.uid}>
                          <div
                            onClick={() => {
                              handleClickSearchMessage(i.uid);
                              handleSetClickRepliedMes(i.uid);
                            }}
                          >
                            <SearchMessageItem m={i} userUid={user.uid} />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    Ничего не найдено
                  </div>
                )}
              </div>
            </div>
            {isAllowedToWrite && (
              <BottomBar
                uid={uid}
                resetSelectMes={resetSelectMes}
                selectRepliedMes={selectRepliedMes}
                blockChat={blockChat}
                selectedMes={selectedMessagesForward}
                toggleForwardPopup={handleOpenForwardPopup}
                dropfiles={updatedFileList}
              />
            )}
          </div>
        ) : (
          <OutletLoading />
        )}
        <InformationBlock
          uid={uid}
          isError={isErrorDoctorByUid}
          isOpen={isOpenInformationPanel}
          isDoctor={Boolean(doctorDataByUid && doctorDataByUid.academy_label)}
          isChat={isChat}
          doctorInfo={doctorDataByUid || null}
          refetchDoctorData={handleREfetchDoctorByUid}
          isLoading={isLoadingDoctorByUid || isFetchingDoctorByUid}
          handleToggleInfInformationPanel={handleToggleInfInformationPanel}
          className={classNames(style.information, {
            [style.isOpen]: isOpenInformationPanel,
          })}
        />
      </>
      {editingMessage && (
        <EditMessagePopup
          blockChat={blockChat}
          editingMessage={editingMessage}
          isOpen={Boolean(editingMessage)}
          setEditingMessage={setEditingMessage}
        />
      )}
      {isOpenForwardPopup && (
        <Popup
          isOpen={isOpenForwardPopup}
          onClose={handleCloseForwardPopup}
          extraClass={style.attachmentPopup}
        >
          <CrossBtn onClick={handleCloseForwardPopup} />
          <Forward
            toggleForwardPopup={handleCloseForwardPopup}
            resetSelectMesForward={resetSelectMes}
            selectedMessagesForward={selectMessage || selectedMessagesForward}
          />
        </Popup>
      )}
      {openBlackList && (
        <BlacklistPopup onClose={handleCloseBlackList} isOpen={openBlackList} />
      )}
    </div>
  );
};

export default ChatWindow;
