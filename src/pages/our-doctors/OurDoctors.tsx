import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { getDoctorsList } from '../../api/doctor/doctors';
import OurDoctorsItem from '../../components/our-doctors-item/OurDoctorsItem';
import RootBoundaryComponent from '../../ui/error-component/RootBoundaryComponent';
import InputSearch from '../../ui/inputs/input-search/InputSearch';
import OutletLoading from '../../ui/suspense-loading/OutletLoading';
import CustomTitle from '../../ui/title/CustomTitle';

import { QKEY_GET_ALL_DOCTORS } from '../../constant/querykeyConstants';

import { MAX_DOCTORS_PER_PAGE } from '../../constant/filterParams';
import sortBySpecializationMatch from '../../hooks/sortBySpecializationMatch';
import { DoctorInfo } from '../../types/doctor/doctor';
import Button from '../../ui/custom-button/Button';

import style from './ourDoctors.module.scss';

const OurDoctors = () => {
  const [searchValue, setSearchValue] = useState('');
  const queryClient = useQueryClient();
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [doctors, setDoctors] = useState<DoctorInfo[]>([]);

  const { doctorUid } = useParams();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['search is our doctor', QKEY_GET_ALL_DOCTORS],
    queryFn: ({ pageParam = 1 }) =>
      getDoctorsList({
        search: searchValue,
        page: pageParam,
        page_size: MAX_DOCTORS_PER_PAGE,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.data.next
        ? parseInt(lastPage.data.next.split('?page=')[1], 10)
        : undefined,
    initialPageParam: 1,
  });

  useEffect(() => {
    if (data && data?.pages.length) {
      const allDoctors = data.pages.flatMap((page) => page.data.results);
      const sortDoctors = sortBySpecializationMatch(allDoctors, searchValue);
      setDoctors([...sortDoctors]);
    }
  }, [data && data.pages, setDoctors]);

  const debouncedInvalidateQueries = useCallback(
    debounce(
      () =>
        queryClient.invalidateQueries({
          queryKey: ['search is our doctor', QKEY_GET_ALL_DOCTORS],
        }),
      500
    ),
    [queryClient]
  );

  const handleChangeValue = useCallback(
    ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => {
      debouncedInvalidateQueries.cancel();
      setSearchValue(value);
      debouncedInvalidateQueries();
    },
    []
  );

  const handleResetValue = useCallback(() => {
    debouncedInvalidateQueries.cancel();
    setSearchValue('');
    debouncedInvalidateQueries();
  }, []);

  // ____________________________
  const [load, setLoad] = useState(true);

  const timeIntervalRef = useRef<NodeJS.Timer | null>(null);

  const handleStopTimer = () => {
    clearInterval(timeIntervalRef.current as NodeJS.Timer);
    timeIntervalRef.current = null;
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setLoad(false);
    }, 400);

    timeIntervalRef.current = timerId;
  }, [isLoading]);
  // _____________________________________

  useEffect(() => {
    return () => {
      setDoctors([]);
      handleStopTimer();
      handleResetValue();
      debouncedInvalidateQueries.cancel();
      queryClient.invalidateQueries({
        queryKey: ['search is our doctor', QKEY_GET_ALL_DOCTORS],
      });
    };
  }, []);

  const lastDoctorElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || isLoading || !hasNextPage) return;

      observerRef.current?.disconnect();
      observerRef.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      });

      observerRef.current.observe(node);
    },
    [isLoading, hasNextPage, fetchNextPage]
  );

  if (isError)
    return <RootBoundaryComponent refreshFunc={debouncedInvalidateQueries} />;

  if (isLoading || load) return <OutletLoading />;

  return (
    <div className={style.container}>
      {doctorUid ? (
        <Outlet />
      ) : (
        <>
          <CustomTitle bold="bold">Наши врачи</CustomTitle>
          <div className={style.search}>
            <InputSearch
              handleResetValue={handleResetValue}
              placeholder="Поиск"
              onChange={handleChangeValue}
              value={searchValue}
            />
          </div>
          <div className={style.doctorsList}>
            {doctors.length ? (
              <div className={style.wrapper}>
                {[...doctors].map((item, index) => (
                  <div
                    style={{ display: 'flex', flexDirection: 'column' }}
                    key={item.id}
                  >
                    <OurDoctorsItem
                      searchValue={searchValue}
                      ref={
                        index === doctors.length - 1
                          ? lastDoctorElementRef
                          : null
                      }
                      {...item}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>Врачи не найдены</p>
            )}
            {hasNextPage && (
              <div
                style={{ width: '100%', textAlign: 'center', marginTop: '5px' }}
              >
                <Button
                  textBtn="Загрузить еще"
                  isLoading={isFetchingNextPage}
                  onClick={(e) => {
                    if (isFetchingNextPage || !hasNextPage) {
                      return e.preventDefault();
                    }
                    return fetchNextPage();
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default memo(OurDoctors);
