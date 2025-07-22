import {
  useInfiniteQuery,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { getDoctorsList } from '../../api/doctor/doctors';
import mutateGetChatListMessage from '../../api/use-infinite-query/get-chat-list/getChatListMutation';

import { ReactComponent as ArchiveSvg } from '../../assets/left-nav-bar/archive.svg';
import { ReactComponent as ChannelsSvg } from '../../assets/left-nav-bar/channels.svg';
import { MAX_CHATS_PER_PAGE } from '../../constant/filterParams';
import { QKEY_GET_ALL_DOCTORS } from '../../constant/querykeyConstants';
import useWindowResize from '../../hooks/useWindowResize';
import useChatListStore from '../../store/chatListStore';
import Divider from '../../ui/divider/Divider';
import ChatItemSkeleton from '../chat-item-skeleton/ChatItemSkeleton';

import sortBySpecializationMatch from '../../hooks/sortBySpecializationMatch';

import { getChatsList, getTextMessagesList } from '../../api/chat/chat';

import { TChannels } from '../../types/websoket/websoket.types';

import ChatFolder from '../chat-folder/ChatFolder';

import DefaultNavBarList from './search-nav-bar-list/DefaultNavBarList';
import SearchNavBarList from './search-nav-bar-list/SearchNavBarList';
import TopBar from './top-bar/TopBar';

import style from './chatWebLeftNavBar.module.scss';
import TopBarHeader from './top-bar-header/TopBarHeader';

/**
 *
 * @returns компонент описывает правую часть чата, с поиском\ выводом списка чатов
 *
 */

const ChatWebNavBar: FC = () => {
  const queryClient = useQueryClient();

  const [searchValue, setSearchValue] = useState<string>('');
  const [isChatListEmpty, setIsChatListEmpty] = useState<boolean>(false);
  const [isTableBarActive, setIsTableBarActive] = useState<boolean>(false);
  const [showedFolder, setShowedFolder] = useState<
    'chats' | 'channels' | 'groups' | 'archive'
  >('chats');

  const chatListStore = useChatListStore((store) => store.chatListStore);
  const triggerOpenChatArchive = useChatListStore(
    (store) => store.triggerOpenChatArchive
  );

  const { table, mobileL } = useWindowResize();

  const {
    dontFetchDoctor,
    isLoadingChatList,
    isFetchingGetChatListMessage,
    isErrorFetchGetChatListMessage,
  } = mutateGetChatListMessage();

  const { ref: refLastDoctor, inView: inViewLastDoctor } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  // ! задача как то убрать самый первый запрос если есть активные чаты
  // ! и есть один лишний запрос при самом первом поиске
  const {
    data: allDoctor,
    isFetching: isFetchingDoctorList,
    isError: isErrorDoctorList,
    isLoading: isLoadingDoctorList,
    hasNextPage: hasNextDoctorPage,
    fetchNextPage: fetchNextDoctorPage,
  } = useInfiniteQuery({
    queryKey: ['search chat left nav bar', QKEY_GET_ALL_DOCTORS],
    queryFn: ({ pageParam = 1 }) => {
      return getDoctorsList({
        search: searchValue,
        page: pageParam,
        page_size: MAX_CHATS_PER_PAGE,
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.next
        ? parseInt(lastPage.data.next.split('?page=')[1], 10)
        : undefined,
    select: (data) => {
      const d = data?.pages.flatMap((page) => page.data.results) ?? [];

      if (!searchValue.length) return d;

      const escapedSearch = searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedSearch})`, 'gi');

      // берем каждого врача
      const nD = d.map((item) => {
        // затем смотри его специализации, и
        // если есть похожие то оставляем одну если ничего нет, то возвращаем все
        const foundSpec = item.specialization.find((spec) => {
          const nameS = spec.name.match(regex);

          if (nameS) return spec;

          return null;
        });

        if (foundSpec) return { ...item, specialization: [foundSpec] };

        return item;
      });

      return sortBySpecializationMatch(nD, searchValue);
    },
    initialPageParam: 1,
    enabled: !dontFetchDoctor || Boolean(searchValue.length) || isChatListEmpty,
  });

  // сначала делаем поиск чатов
  const fetchChatListWithSearch = (s: string) => {
    return getChatsList({
      page_size: MAX_CHATS_PER_PAGE,
      search: s,
    });
  };

  // потом делаем поиск сообщений в каждом чате отдельно
  const fetchTextMessage = (uidInterlocutor: string, searchV: string) => {
    return getTextMessagesList(uidInterlocutor, {
      page_size: MAX_CHATS_PER_PAGE,
      ordering: 'created_at',
      search: searchV,
    });
  };

  // запрос именно на чаты при поиске
  const {
    data: chatsWithSearch,
    isLoading: isLoadingChatsWithSearch,
    isError: isErrorChatsWithSearch,
  } = useQuery({
    queryKey: ['search chat left nav bar', 'get chats with search'],
    queryFn: () => {
      return fetchChatListWithSearch(searchValue);
    },
    select: (data) => {
      return data.data.results || [];
    },
    retry: false,

    // Если ты передаешь в enabled значение false, запрос не будет выполнен автоматически.
    enabled: !!searchValue.length,
  });

  const searchMessageInChats = useQueries({
    queries: chatsWithSearch?.length
      ? chatsWithSearch.map((chat) => {
          return {
            queryKey: ['search chat left nav bar', 'get chat', chat.chat.uid],
            queryFn: () => {
              console.log('chat.chat.uid', chat.chat.uid);
              return fetchTextMessage(chat.chat.uid, searchValue);
            },
            enabled: !!chatsWithSearch.length,
          };
        })
      : [],
  });

  // const isLoadingSearchMessage = useMemo(() => {
  //   return searchMessageInChats.every(
  //     (query) => query.isSuccess || query.isError
  //   );
  // }, [searchMessageInChats]);

  const allSearchMessages = useMemo(() => {
    return searchMessageInChats.flatMap((query) =>
      query.status === 'success' && query.data?.data?.results
        ? query.data.data.results
        : []
    );
  }, [searchMessageInChats]);

  const debouncedInvalidateQueries = useCallback(
    debounce(
      () =>
        queryClient.invalidateQueries({
          predicate: (query) =>
            // @ts-ignore
            query.queryKey[0].startsWith('search chat left nav bar'),
        }),
      500
    ),
    [queryClient]
  );

  useEffect(() => {
    return () => {
      debouncedInvalidateQueries();
    };
  }, []);

  const handleSetSearchParams = useCallback((value: string) => {
    debouncedInvalidateQueries.cancel();
    setSearchValue(value);
    debouncedInvalidateQueries();
  }, []);

  const handleCloseTab = () => {
    setShowedFolder('chats');
  };

  const handleResetValue = useCallback(
    (withoutChatListReset: boolean = false) => {
      setSearchValue('');
      if (!withoutChatListReset) handleCloseTab();
    },
    [searchValue, handleCloseTab]
  );

  // открыть левое меню если оно ужато
  const toggleTableBar = useCallback(() => {
    if (table) setIsTableBarActive((prevState) => !prevState);
  }, [setIsTableBarActive, table]);

  useEffect(() => {
    if (
      triggerOpenChatArchive &&
      triggerOpenChatArchive.chatId &&
      triggerOpenChatArchive.isActive
    ) {
      return handleResetValue(true);
    }

    return () => {};
  }, [triggerOpenChatArchive?.active_date]);

  useEffect(() => {
    if (
      !isLoadingDoctorList &&
      !isFetchingDoctorList &&
      inViewLastDoctor &&
      hasNextDoctorPage
    ) {
      fetchNextDoctorPage();
    }
  }, [
    isLoadingDoctorList,
    isFetchingDoctorList,
    hasNextDoctorPage,
    inViewLastDoctor,
    hasNextDoctorPage,
  ]);

  const filteredChatList = useMemo(() => {
    if (showedFolder === 'archive') {
      return chatListStore.filter((item) => !item.is_active);
    }

    if (showedFolder === 'channels') {
      return chatListStore.filter(
        (item) =>
          item.is_active &&
          [TChannels.PRIVATE_CHANNEL, TChannels.PUBLIC_CHANNEL].includes(
            item.chat_type
          )
      );
    }

    if (showedFolder === 'groups') {
      return chatListStore.filter(
        (item) =>
          item.is_active &&
          [TChannels.PRIVATE_GROUP, TChannels.PUBLIC_GROUP].includes(
            item.chat_type
          )
      );
    }

    return chatListStore.filter(
      (item) => item.is_active && item.chat_type === TChannels.CHAT
    );
  }, [chatListStore, showedFolder]);

  const isArchiveEmpty = useMemo(
    () =>
      chatListStore.filter(
        (item) => !item.is_active && item.chat_type === TChannels.CHAT
      ).length === 0,
    [chatListStore]
  );

  useEffect(() => {
    if (
      showedFolder === 'chats' &&
      filteredChatList &&
      filteredChatList.length === 0
    )
      setIsChatListEmpty(true);
    else setIsChatListEmpty(false);
  }, [filteredChatList, showedFolder]);

  return (
    <div
      id="chatWebLeftNavBar"
      className={classNames(style.navBar, {
        [style.tableNavBar]: table && !mobileL,
      })}
      onMouseOver={toggleTableBar}
      onMouseOut={toggleTableBar}
      onFocus={toggleTableBar}
      onBlur={toggleTableBar}
    >
      <TopBar
        setValueInputSearch={handleSetSearchParams}
        resetSearchValue={handleResetValue}
        valueInputSearch={searchValue}
      />
      <Divider />
      {!searchValue ? (
        showedFolder === 'chats' ? (
          <>
            {!isArchiveEmpty && (
              <div
                className={style.icons}
                onClick={() => setShowedFolder('archive')}
              >
                <div className={style.iconsTitle}>
                  <div className={style.iconsIcon}>
                    <ArchiveSvg />
                  </div>
                  <h2 className={style.iconsCaption}>Архив</h2>
                </div>
              </div>
            )}

            <ChatFolder
              icon={<ChannelsSvg />}
              label="Каналы"
              onClick={() => setShowedFolder('channels')}
            />
            <ChatFolder
              icon={<ChannelsSvg />}
              label="Группы"
              onClick={() => setShowedFolder('groups')}
            />
            <Divider />
          </>
        ) : (
          <>
            {showedFolder === 'archive' && (
              <TopBarHeader
                title="Чаты в архиве"
                onBack={handleCloseTab}
                table={table}
                mobileL={mobileL}
              />
            )}
            {showedFolder === 'channels' && (
              <TopBarHeader
                title="Каналы"
                onBack={handleCloseTab}
                table={table}
                mobileL={mobileL}
              />
            )}

            {showedFolder === 'groups' && (
              <TopBarHeader
                title="Группы"
                onBack={handleCloseTab}
                table={table}
                mobileL={mobileL}
              />
            )}
            <Divider />
          </>
        )
      ) : null}
      {isLoadingChatList ||
      isLoadingChatsWithSearch ||
      isFetchingGetChatListMessage ||
      isLoadingDoctorList ? (
        <ChatItemSkeleton cards={5} />
      ) : searchValue ? (
        <SearchNavBarList
          isFetchDoctor={isFetchingDoctorList}
          isFetchChat={isLoadingChatsWithSearch}
          allSearchMessages={allSearchMessages}
          chatList={chatsWithSearch || null}
          refDoctor={refLastDoctor}
          doctorList={allDoctor || null}
          isError={isErrorChatsWithSearch || isErrorDoctorList}
          refresh={handleResetValue}
          isTableBarActive={!table ? isTableBarActive : true}
        />
      ) : (
        <div className={style.chatListWrapper}>
          <DefaultNavBarList
            isFetchDoctor={isFetchingDoctorList}
            isFetchChat={isFetchingGetChatListMessage}
            refDoctor={refLastDoctor}
            isShowArchivedChats={showedFolder === 'archive'}
            chatList={filteredChatList}
            isTableBarActive={table ? isTableBarActive : true}
            refresh={handleResetValue}
            isError={isErrorFetchGetChatListMessage || isErrorDoctorList}
            doctorsList={allDoctor || []}
          />
        </div>
      )}
    </div>
  );
};

export default ChatWebNavBar;
