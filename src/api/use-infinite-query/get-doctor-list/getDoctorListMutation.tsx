import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

import debounce from 'lodash.debounce';

import { MAX_CHATS_PER_PAGE } from '../../../constant/filterParams';
import { QKEY_GET_ALL_DOCTOR_LIST } from '../../../constant/querykeyConstants';
import { DoctorsList } from '../../../types/doctor/doctor';
import { getDoctorsList } from '../../doctor/doctors';

interface Props {
  searchValue: string;
}

// ! в файле ChatWindow

// pageParams , uid первичные данные, далее все через функции
const mutateDoctorList = ({ searchValue }: Props) => {
  const queryClient = useQueryClient();
  const key = [QKEY_GET_ALL_DOCTOR_LIST, { searchValue }];

  const notifyError = (text: string) =>
    toast.error(text, {
      duration: 4000,
    });

  // *основной запрос на получение текстовых сообщений
  const fetchDoctorList = (pageInt: number, search: string) => {
    return getDoctorsList({
      search,
      page: pageInt,
      page_size: MAX_CHATS_PER_PAGE,
    });
  };

  const {
    data: doctorListMutate,
    fetchNextPage: fetchNextDoctorListPage,
    hasNextPage: hasNextDoctorListPage,
    isFetching: isFetchingDoctorListMessage,
    isError: isErrorFetchDoctorListMessage,
    error,
  } = useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam }) => {
      return fetchDoctorList(pageParam, searchValue);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.data.next) {
        const next = parseInt(lastPage.data.next.split('?page=')[1], 10);
        return next;
      }
      return undefined;
    },
    select: (data) => {
      return data;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (error) notifyError(error.message);
  }, [error]);

  const resetInfiniteQueryPagination = () => {
    queryClient.setQueryData<
      | {
          pageParams: number[];
          pages: { data: DoctorsList[] }[];
        }
      | undefined
    >(key, (oldData) => {
      if (!oldData) return undefined;

      return {
        pages: [oldData?.pages?.[0] ?? []],
        pageParams: [1],
      };
    });
    queryClient.invalidateQueries({ queryKey: key });
  };

  const refreshDoctorList = useMemo(
    () =>
      debounce(() => {
        resetInfiniteQueryPagination();
      }, 1000),
    []
  );

  useEffect(() => {
    refreshDoctorList();
  }, [searchValue]);

  return {
    doctorListMutate,
    hasNextDoctorListPage,
    isFetchingDoctorListMessage,
    isErrorFetchDoctorListMessage,
    fetchNextDoctorListPage,
    resetInfiniteQueryPagination,
  };
};

export default mutateDoctorList;
