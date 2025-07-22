/* eslint-disable @typescript-eslint/naming-convention */
import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { AxiosResponse } from 'axios';
import classNames from 'classnames';
import { Interweave } from 'interweave';
import { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLocation, useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { getTextMessagesList } from '../../../api/chat/chat';
import { MAX_CHATS_PER_PAGE } from '../../../constant/filterParams';
import useUserStore from '../../../store/userStore';
import {
  MessageListItem,
  MessagesList,
} from '../../../types/chat/messageListItem';
import RootBoundaryComponent from '../../../ui/error-component/RootBoundaryComponent';
import getTimeFromDate from '../../../utils/chat/getTimeFromDate';
import MessageItem from '../../message-item/MessageItem';

import { QKEY_GET_TEXT_MESSAGE } from '../../../constant/querykeyConstants';
import formatDate from '../../../utils/formatDate';

import getMessageDate from '../../../utils/chat/getMessageDate';

import { ReactComponent as FrowardSvg } from '../../../assets/bottom-bar/forward.svg';

import CrossBtn from '../../../ui/cross-button/CrossBtn';

import style from './averageBlock.module.scss';

const fetchTextMessage = (uidInterlocutor: string, pageInt: number) => {
  return getTextMessagesList(uidInterlocutor, {
    page: pageInt,
    page_size: MAX_CHATS_PER_PAGE,
    ordering: 'created_at',
  });
};

// _____________________________________________________
// ! компоненет отображения сообщения
interface Props {
  date: string;
  index: number;
  blockChat: boolean;
  data: MessageListItem;
  userUid: string | null;
  viewRepliedMes: boolean;
  selectedMessagesForward: MessageListItem[];
  setRepliedMessageOnVirtualize: (m: MessageListItem) => void;
  setEditingMessage: (id: MessageListItem | null) => void;
  handleChangeSelectMessage: (m: MessageListItem) => void;
  toggleMessageSelectionForward: (fMes: MessageListItem) => void;
  handleScrollRepliedMessage: ({
    messageRepliedUid,
  }: {
    messageRepliedUid: string;
  }) => void;
}

export const Row: FC<Props> = ({
  data,
  date,
  index,
  userUid,
  blockChat,
  viewRepliedMes,
  setEditingMessage,
  setRepliedMessageOnVirtualize,
  selectedMessagesForward,
  handleChangeSelectMessage,
  handleScrollRepliedMessage,
  toggleMessageSelectionForward,
}) => {
  const { from_user, created_at } = data;
  const type = from_user.uid === userUid ? 'send' : 'get';
  const time = getTimeFromDate(created_at);

  const isDate = useMemo(() => {
    if (date.length > 0 && index !== 0) {
      return (
        <span className={style.dateText}>
          {getMessageDate(new Date(date).getTime())}
        </span>
      );
    }

    if (index === 0 && created_at) {
      return (
        <span className={style.dateText}>
          {getMessageDate(new Date(created_at * 1000).getTime())}
        </span>
      );
    }

    return <span />;
  }, [date, index]);

  const isSelectMes = useMemo(() => {
    const indexId = selectedMessagesForward.findIndex((item) => {
      return item.id === data.id;
    });

    if (indexId !== -1 && indexId !== undefined) {
      return true;
    }

    return false;
  }, [selectedMessagesForward]);

  return (
    <div
      style={{
        paddingBottom: '10px',
        borderRadius: '15px',
      }}
    >
      <div className={style.dateInfo}>{isDate}</div>
      <MessageItem
        type={type}
        time={time}
        message={data}
        userUid={userUid}
        blockChat={blockChat}
        isSelect={isSelectMes}
        viewRepliedMes={viewRepliedMes}
        setEditingMessage={setEditingMessage}
        setRepliedMessageOnVirtualize={setRepliedMessageOnVirtualize}
        toggleSelectMessage={toggleMessageSelectionForward}
        selectMode={Boolean(selectedMessagesForward.length)}
        handleChangeSelectMessage={handleChangeSelectMessage}
        handleScrollRepliedMessage={handleScrollRepliedMessage}
      />
    </div>
  );
};

// ____________________________________________________________
// ! компонент вывода сообщений

type PropsRowVirtualizerDynamic = {
  uid: string;
  blockChat: boolean;
  checkEnableForLoadingMessageInfiniteQuery: {
    enabled: boolean;
    initialPage: number;
  };
  // _
  clickUidRepliedMesToScroll: string | null;
  handleSetClickRepliedMes: (uidM: string) => void;
  resetClickRepliedMes: () => void;
  // _
  handleClickSearchMessage: (value: string) => void;
  // -
  positionInitialMes: number | null;
  handleRefreshChat: () => void;
  handleOpeBlackList: () => void;
  resetSelectRepliedMes: () => void;
  selectRepliedMes: MessageListItem | null;
  selectedMessagesForward: MessageListItem[];
  setSelectRepliedMes: (m: MessageListItem) => void;
  handleChangeSelectMessage: (m: MessageListItem) => void;
  setEditingMessage: (id: MessageListItem | null) => void;
  toggleMessageSelectionForward: (fMes: MessageListItem) => void;
  checkLastUidMessage: {
    uid: string;
    type: string;
  } | null;
};

const AverageBlock: FC<PropsRowVirtualizerDynamic> = ({
  blockChat,
  uid: chatUid,
  selectRepliedMes,
  handleRefreshChat,
  setEditingMessage,
  handleOpeBlackList,
  positionInitialMes,
  setSelectRepliedMes,
  checkLastUidMessage,
  resetSelectRepliedMes,
  selectedMessagesForward,
  clickUidRepliedMesToScroll,
  handleSetClickRepliedMes,
  handleClickSearchMessage,
  resetClickRepliedMes,
  handleChangeSelectMessage,
  toggleMessageSelectionForward,
  checkEnableForLoadingMessageInfiniteQuery,
}) => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const toggleViewBlacklistPopUp = () => {
    handleOpeBlackList();
  };

  const user = useUserStore(useShallow((state) => state.user));

  // данные для начала загрузки сообщений и initialPage приходят из props
  // далее делаем запрос на сами сообщения
  const {
    data,
    isLoading,

    isFetchingPreviousPage,
    isFetchingNextPage,

    fetchNextPage,
    fetchPreviousPage,

    hasPreviousPage,
    hasNextPage,

    isError,
  } = useInfiniteQuery({
    queryKey: [QKEY_GET_TEXT_MESSAGE, chatUid],
    queryFn: ({ pageParam }) => {
      if (chatUid) {
        return fetchTextMessage(chatUid, pageParam);
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
    getPreviousPageParam: (firstPage) => {
      if (
        firstPage &&
        firstPage.data.previous &&
        firstPage.data.previous.indexOf('page=') !== -1
      ) {
        const prev = parseInt(firstPage.data.previous.split('page=')[1], 10);
        return prev;
      }
      if (firstPage && firstPage.data.previous) {
        return 1;
      }

      return null;
    },
    enabled: checkEnableForLoadingMessageInfiniteQuery.enabled,
    initialPageParam: checkEnableForLoadingMessageInfiniteQuery.initialPage,
  });

  // получаем все сообщения вместе с теми что приходят от сокетов
  const cachedDataMessageList = queryClient.getQueryData<
    InfiniteData<AxiosResponse<MessagesList>>
  >([QKEY_GET_TEXT_MESSAGE, chatUid]);

  const allRows = useMemo(() => {
    return (
      cachedDataMessageList?.pages.flatMap(
        (page) => page?.data?.results || []
      ) ?? []
    );
  }, [cachedDataMessageList]);

  const lastIndexBeforeUndefined = useMemo(() => {
    if (!cachedDataMessageList || !cachedDataMessageList.pages?.length) {
      return null; // Если данных нет, возвращаем null
    }

    // Если только одна страница, возвращаем последний UID из результатов этой страницы
    if (cachedDataMessageList.pages.length === 1) {
      const results = cachedDataMessageList.pages[0]?.data?.results || [];
      return results.length ? results[results.length - 1].uid : null;
    }

    // Проходим по страницам и находим последнюю действительную перед undefined
    for (let i = 0; i < cachedDataMessageList.pages.length; i += 1) {
      const page = cachedDataMessageList.pages[i];

      // Если текущая страница undefined
      if (page === undefined) {
        // Если это первая страница и она undefined
        if (i === 0) {
          const firstPageResults =
            cachedDataMessageList.pages[0]?.data?.results || [];
          return firstPageResults.length ? firstPageResults[0].uid : null;
        }

        // Иначе возвращаем последний UID из предыдущей страницы
        const prevPage = cachedDataMessageList.pages[i - 1];
        const prevPageResults = prevPage?.data?.results || [];
        return prevPageResults.length
          ? prevPageResults[prevPageResults.length - 1].uid
          : null;
      }
    }

    return null; // Если undefined не найден
  }, [cachedDataMessageList]);

  const count = useMemo(() => {
    if (!allRows.length) return 0;
    return allRows.length;
  }, [allRows]);

  const scrollOffsetKey = `virtualizer_scrollOffset_${chatUid}`;
  const cacheKey = `virtualizer_measurementsCache_${chatUid}`;

  const {
    getTotalSize,
    scrollToIndex,
    getVirtualItems,
    isScrolling,
    range,
    ...virtualizer
  } = useVirtualizer({
    count,
    enabled: Boolean(count),
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 91, []),
    overscan: 5,
    initialOffset: useCallback(() => {
      if (typeof sessionStorage !== 'undefined') {
        const os = sessionStorage.getItem(scrollOffsetKey);

        if (os) {
          return parseInt(os, 10);
        }
      }

      if (positionInitialMes) {
        const s = (positionInitialMes - 2) * 91;
        return s;
      }
      return 0;
    }, [chatUid, positionInitialMes]),
    initialMeasurementsCache: useMemo(() => {
      if (typeof sessionStorage === 'undefined') return undefined;

      const savedCache = sessionStorage.getItem(cacheKey);

      return savedCache ? JSON.parse(savedCache) : undefined;
    }, [chatUid]),
  });

  // ! _______________________________
  const setRepliedMessageOnVirtualize = useCallback(
    (m: MessageListItem) => {
      const index = allRows.findIndex((item) => {
        return item.uid === m.uid;
      });

      console.log('index', index);

      if (index !== -1) {
        setSelectRepliedMes(m);
      }
    },
    [allRows]
  );

  useEffect(() => {
    const serializedCache = JSON.stringify(
      Array.from(virtualizer.measurementsCache)
    );
    sessionStorage.setItem(cacheKey, serializedCache);
  }, [virtualizer.measurementsCache, chatUid]);

  useEffect(() => {
    if (virtualizer.scrollOffset !== null) {
      sessionStorage.setItem(
        scrollOffsetKey,
        virtualizer.scrollOffset.toString()
      );
    }
  }, [virtualizer.scrollOffset, chatUid]);

  // ____________________________________
  // ref для последнего и первого сообщения для пагинации

  const { ref: refNextTextMessage, inView: inViewNextTextMessage } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  const { ref: refPrevTextMessage, inView: inViewPrevTextMessage } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  const { ref: refScrollElement, inView: inViewScrollElement } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  useEffect(() => {
    if (!isScrolling && clickUidRepliedMesToScroll && inViewScrollElement) {
      setTimeout(() => {
        resetClickRepliedMes();
      }, 2000);
    }
  }, [isScrolling, clickUidRepliedMesToScroll, inViewScrollElement]);

  useEffect(() => {
    if (inViewNextTextMessage && hasNextPage && !isFetchingNextPage) {
      console.log('next');
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, inViewNextTextMessage, isFetchingNextPage]);

  // ___________________________________________________

  const prevOffSet = useRef<boolean>(false);

  useEffect(() => {
    if (inViewPrevTextMessage && hasPreviousPage && !isFetchingPreviousPage) {
      prevOffSet.current = true;
      fetchPreviousPage();
    }
  }, [
    fetchNextPage,
    hasPreviousPage,
    inViewPrevTextMessage,
    fetchPreviousPage,
  ]);

  useEffect(() => {
    if (
      !isFetchingPreviousPage &&
      data &&
      data.pages[0] &&
      prevOffSet.current
    ) {
      const l = data.pages[0].data.results.length;
      scrollToIndex(l, {
        align: 'start',
      });
      prevOffSet.current = false;
    }
  }, [isFetchingPreviousPage, prevOffSet.current]);

  useEffect(() => {
    if (count && range?.endIndex && count - range.endIndex < 10) {
      scrollToIndex(count - 1);
    }
  }, [count]);

  const parentHeight = useMemo(() => {
    if (parentRef.current) {
      return parentRef.current?.offsetHeight;
    }

    return 534;
  }, [parentRef.current]);

  // логика скрола к сообщению на который ответили
  const handleScrollRepliedMessage = ({
    messageRepliedUid,
  }: {
    messageRepliedUid: string;
  }) => {
    const messageForIndex = allRows.findIndex(
      (item) => item.uid === messageRepliedUid
    );
    if (messageForIndex !== -1) {
      // ! ____________________________________
      handleSetClickRepliedMes(messageRepliedUid);
      return scrollToIndex(messageForIndex, {
        align: 'center',
      });
    }
    console.log('не найдено');
    return handleClickSearchMessage(messageRepliedUid);
  };

  const location = useLocation();
  const stateUidFromLocation = location.state?.searchUidMessage;
  const navigate = useNavigate();

  const resetLocationState = () => {
    navigate(location.pathname); // Переход на тот же путь, без состояния
  };

  // ! это срабатывает когда мы нажимаем на ссылку в левом списке во время поиска
  useEffect(() => {
    if (stateUidFromLocation && stateUidFromLocation.length !== 0) {
      handleScrollRepliedMessage({ messageRepliedUid: stateUidFromLocation });
      resetLocationState();
    }
  }, [stateUidFromLocation]);

  if (isLoading)
    return (
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
    );

  if (count === 0)
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span>Сообщений нет</span>
        {blockChat && (
          <div onClick={toggleViewBlacklistPopUp}>
            <span
              style={{
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Пользователь в Черном списке
            </span>
          </div>
        )}
      </div>
    );

  if (isError)
    return (
      <RootBoundaryComponent
        refreshFunc={handleRefreshChat}
        isLoading={isLoading}
      />
    );

  return (
    <>
      <div
        style={{
          height: '100%',
          width: '100%',
          contain: 'strict',
          position: 'relative',
        }}
      >
        <div
          ref={parentRef}
          className="List"
          id="wrapperMessageList"
          style={{
            height: '100%',
            width: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            contain: 'strict',
          }}
        >
          <div
            style={{
              height: getTotalSize(),
              width: '100%',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                padding: '0 5px',
                top: 0,
                left: 0,
                width: '100%',
                transform:
                  getTotalSize() < parentHeight && count !== 0
                    ? `translateY(${parentHeight - getTotalSize()}px)`
                    : `translateY(${getVirtualItems()[0]?.start ?? 0}px)`,
                // `translateY(${getVirtualItems()[0]?.start ?? 0}px)`,
              }}
            >
              {allRows &&
                allRows.length &&
                getVirtualItems().map((virtualRow) => {
                  const { uid } = allRows[virtualRow.index];

                  const { created_at } = allRows[virtualRow.index];
                  const messageDay = formatDate(created_at);
                  const prevTest = formatDate(
                    allRows[virtualRow.index - 1]?.created_at
                  );

                  let date = '';
                  if (messageDay !== prevTest) {
                    date = messageDay;
                  }
                  const repliedMes = Boolean(
                    uid === clickUidRepliedMesToScroll
                  );

                  return (
                    <div
                      key={virtualRow.key}
                      data-index={virtualRow.index}
                      ref={virtualizer.measureElement}
                    >
                      {/* ! !!!!!!! */}
                      <div
                        ref={
                          uid === lastIndexBeforeUndefined
                            ? refNextTextMessage
                            : null
                        }
                      />
                      <div ref={repliedMes ? refScrollElement : null} />
                      {checkLastUidMessage &&
                        checkLastUidMessage.uid === uid &&
                        checkLastUidMessage.type === 'new' && (
                          <div className={style.dateInfo}>
                            <span
                              className={style.infoText}
                              title="не прочитанные сообщения"
                            >
                              Непрочитанные сообщения
                            </span>
                          </div>
                        )}
                      <Row
                        date={date}
                        blockChat={blockChat}
                        viewRepliedMes={repliedMes}
                        index={virtualRow.index}
                        userUid={user?.uid || null}
                        data={allRows[virtualRow.index]}
                        setEditingMessage={setEditingMessage}
                        setRepliedMessageOnVirtualize={
                          setRepliedMessageOnVirtualize
                        }
                        selectedMessagesForward={selectedMessagesForward}
                        handleChangeSelectMessage={handleChangeSelectMessage}
                        handleScrollRepliedMessage={handleScrollRepliedMessage}
                        toggleMessageSelectionForward={
                          toggleMessageSelectionForward
                        }
                      />
                      <div
                        ref={virtualRow.index === 0 ? refPrevTextMessage : null}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {(isFetchingNextPage || isFetchingPreviousPage) && (
          <div
            style={{
              position: 'absolute',
              inset: '0',
              backgroundColor: 'rgba(0, 0, 0, 0.224)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h2 style={{ color: 'rgb(89, 81, 81)' }}>Loading...</h2>
          </div>
        )}
        {selectRepliedMes && (
          <div
            className={classNames(style.blackListInfo, style.repliedWrapper)}
          >
            <FrowardSvg width={30} height={30} className={style.repIcon} />
            <div className={style.replied}>
              <span>
                В ответ{' '}
                {`${selectRepliedMes.from_user.first_name} ${selectRepliedMes.from_user.last_name}`}
              </span>
              <Interweave content={selectRepliedMes.content} />
            </div>
            <CrossBtn onClick={resetSelectRepliedMes} />
          </div>
        )}
        {blockChat && (
          <div
            className={classNames(style.blackListInfo, {
              [style.opac]: isScrolling,
            })}
          >
            <span>
              Пользователь в{' '}
              <span
                style={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
                onClick={toggleViewBlacklistPopUp}
              >
                Черном списке
              </span>
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default AverageBlock;
