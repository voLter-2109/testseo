import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import useUserStore from '../../store/userStore';
import { DoctorInfo } from '../../types/doctor/doctor';

import { QKEY_GET_DOCTOR } from '../../constant/querykeyConstants';

import { getCurrentDoctor } from './doctors';

type TReturnProps = {
  doctor: DoctorInfo | null;
  isLoading: boolean;
  error: Error | null;
};

const getDoctorMethods = (): TReturnProps => {
  const { setDoctor, doctor } = useUserStore((state) => state);
  const { user } = useUserStore((state) => state);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QKEY_GET_DOCTOR],
    queryFn: () => getCurrentDoctor(),
    retry: false,
    // Если ты передаешь в enabled значение false, запрос не будет выполнен автоматически.
    enabled: false,
  });

  useEffect(() => {
    if (user && user.is_doctor) {
      refetch();
    }
  }, [user && user.is_doctor]);

  useEffect(() => {
    if (data?.data) {
      setDoctor(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (user && user.is_doctor) {
      queryClient.invalidateQueries({
        queryKey: [QKEY_GET_DOCTOR],
      });
    }
  }, [user?.is_doctor]);

  return {
    doctor,
    isLoading,
    error,
  };
};

export default getDoctorMethods;
