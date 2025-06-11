import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { FC, useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { QKEY_GET_BLACKLIST } from '../../../constant/querykeyConstants';
import Popup from '../../../ui/popup/Popup';

import {
  deleteFromContactBlackList,
  getContactBlackList,
} from '../../../api/contact/contact';
import useChatListStore from '../../../store/chatListStore';

import useNotifyToast from '../../../hooks/useNotifyToast';

import { ContactBlackList } from '../../../types/contact/contact';

import CrossBtn from '../../../ui/cross-button/CrossBtn';

import BlackUserList from './BlackList';

import style from './BlacklistPopup.module.scss';

interface BlacklistPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlacklistPopup: FC<BlacklistPopupProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();

  const { ref: refLastUserInBlackList, inView: inViewLastUserInBlackList } =
    useInView({
      threshold: 0,
      triggerOnce: false,
    });

  // кешированные данные по черному списку
  const cachedData = queryClient.getQueryData<
    InfiniteData<AxiosResponse<ContactBlackList>>
  >([QKEY_GET_BLACKLIST]);
  const blUsers = cachedData?.pages.flatMap((page) => page.data.results) ?? [];

  // метод store, локально меняет статус чата, что бы не обновлять все чаты
  const setBlockedChatById = useChatListStore(
    (state) => state.setBlockedChatById
  );

  // * _________________________
  // методы связанные только с получением черного списка
  const fetchListBLUsers = useCallback((pageInt: number) => {
    return getContactBlackList({
      page: pageInt,
      page_size: 50,
    });
  }, []);

  const {
    fetchNextPage: fetchNextPageBL,
    hasNextPage: hasNextPagesBL,
    isLoading: loadingAllBL,
    isFetching: isFetchingNextPageBL,
    refetch: refetchBL,
    isError: isErrorBL,
  } = useInfiniteQuery({
    queryKey: [QKEY_GET_BLACKLIST],
    queryFn: ({ pageParam = 1 }) => {
      return fetchListBLUsers(pageParam);
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.next
        ? parseInt(lastPage.data.next.split('page=')[1], 10)
        : undefined,

    initialPageParam: 1,
  });

  // проверяем находится ли пользователь в видимой области, и если нет никаких действующих
  // загрузок , то запрашиваем следующую страницу
  useEffect(() => {
    if (
      !loadingAllBL &&
      !isFetchingNextPageBL &&
      inViewLastUserInBlackList &&
      hasNextPagesBL
    ) {
      fetchNextPageBL();
    }
  }, [
    inViewLastUserInBlackList,
    fetchNextPageBL,
    hasNextPagesBL,
    loadingAllBL,
    isFetchingNextPageBL,
  ]);

  // как вариант конечно не запрашивать каждый раз списком заново,
  // а работать с кешем или все таки придумать какой нибудь ключ
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [QKEY_GET_BLACKLIST],
    });
  }, []);

  // * _______________________
  // методы связанные с удалением из черного списка

  const { mutate, isPending: isPendingDeleteUser } = useMutation({
    mutationKey: [['delete user in BL']],
    mutationFn: (userId: string) => {
      return deleteFromContactBlackList(userId);
    },
    onSuccess: (_, variables) => {
      // если запрос вернул ok, то удаляем пользователя из кеша
      if (!cachedData) return cachedData;

      queryClient.setQueryData<InfiniteData<AxiosResponse<ContactBlackList>>>(
        [QKEY_GET_BLACKLIST],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              return {
                // axios
                ...page,
                // data -> count, result....
                data: {
                  ...page.data,
                  results: page.data.results.filter(
                    (user) => user.blocked_user.uid !== variables
                  ),
                },
              };
            }),
          };
        }
      );

      setBlockedChatById(variables);

      return null;
    },
    onError: () => {
      useNotifyToast({
        text: 'Не удалось удалить пользователя из черного списка',
        type: 'error',
      });
    },
  });

  const handleBlackListDeleteClick = (uid: string) => {
    mutate(uid);
  };

  return (
    <>
      {isOpen && (
        <Popup
          extraClass={style.blackListPopup}
          onClose={onClose}
          isOpen={isOpen}
        >
          <CrossBtn onClick={onClose} />
          <BlackUserList
            isLoading={loadingAllBL}
            blUsers={blUsers}
            isPending={isPendingDeleteUser}
            refInter={refLastUserInBlackList}
            isError={isErrorBL}
            isFetching={isFetchingNextPageBL}
            refreshComponent={refetchBL}
            handleBlackListDeleteClick={handleBlackListDeleteClick}
          />
        </Popup>
      )}
    </>
  );
};

export default BlacklistPopup;
