import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useShallow } from 'zustand/react/shallow';

import { MAX_CHATS_PER_PAGE } from '../../../constant/filterParams';
import { QKEY_GET_ALL_CHAT_LIST } from '../../../constant/querykeyConstants';
import useChatListStore from '../../../store/chatListStore';
import userStore from '../../../store/userStore';
import { getChatsList } from '../../chat/chat';

// pageParams , uid первичные данные, далее все через функции
const mutateGetChatListMessage = () => {
  const key = [QKEY_GET_ALL_CHAT_LIST];
  const [dontFetchDoctor, setDontFetchDoctor] = useState(true);

  const setStoreChatList = useChatListStore(
    useShallow((state) => state.setStoreChatList)
  );

  const user = userStore((state) => state.user);

  const notifyError = (text: string) =>
    toast.error(text, {
      duration: 4000,
    });

  // *основной запрос на получение текстовых сообщений
  const fetchChatList = (pageInt: number) => {
    return getChatsList({
      page: pageInt,
      ordering: 'last_message.created_at',
      page_size: MAX_CHATS_PER_PAGE,
    });
  };

  const {
    data: chatListMutate,
    fetchNextPage: fetchNextGetChatListMessagePage,
    hasNextPage: hasNextGetChatListPage,
    isFetching: isFetchingGetChatListMessage,
    isLoading: isLoadingChatList,
    isError: isErrorFetchGetChatListMessage,
    error,
  } = useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam }) => {
      console.log('_______________1');
      return fetchChatList(pageParam);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.data.next) {
        const next = parseInt(lastPage.data.next.split('page=')[1], 10);
        return next;
      }
      return undefined;
    },
    // Если ты передаешь в enabled значение false, запрос не будет выполнен автоматически.
    enabled: Boolean(user?.uid),
    initialPageParam: 1,
  });

  useEffect(() => {
    if (
      !isLoadingChatList &&
      !isFetchingGetChatListMessage &&
      hasNextGetChatListPage &&
      !isErrorFetchGetChatListMessage
    ) {
      fetchNextGetChatListMessagePage();
    }

    if (
      !hasNextGetChatListPage &&
      !isLoadingChatList &&
      !isFetchingGetChatListMessage &&
      !isErrorFetchGetChatListMessage &&
      chatListMutate
    ) {
      setDontFetchDoctor(true);
      chatListMutate.pages.forEach((chatList) => {
        setStoreChatList(chatList.data.results);
      });
    }

    if (
      !isLoadingChatList &&
      Boolean(!chatListMutate?.pages[0].data.results.length)
    ) {
      setDontFetchDoctor(false);
    }
  }, [
    isLoadingChatList,
    isFetchingGetChatListMessage,
    hasNextGetChatListPage,
    chatListMutate?.pages,
  ]);

  useEffect(() => {
    if (error) notifyError(error.message);
  }, [error]);

  return {
    dontFetchDoctor,
    chatListMutate,
    isLoadingChatList,
    hasNextGetChatListPage,
    isFetchingGetChatListMessage,
    isErrorFetchGetChatListMessage,
    fetchNextGetChatListMessagePage,
  };
};

export default mutateGetChatListMessage;
