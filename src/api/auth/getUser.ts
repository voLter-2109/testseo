import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

import { QKEY_GET_USER } from '../../constant/querykeyConstants';
import { REFRESH_TOKEN } from '../../constant/token.constants';
import useUserStore from '../../store/userStore';
import { IUserProfile } from '../../types/user/user';
import { getСurrentUser } from '../user/user';

type TReturnProps = {
  user: IUserProfile | null;
  isLoading: boolean;
  error: Error | null;
};

const getUserMethods = (): TReturnProps => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const refresh = Cookies.get(REFRESH_TOKEN);

  const { data, isLoading, error } = useQuery({
    queryKey: [QKEY_GET_USER],
    queryFn: () => {
      return getСurrentUser();
    },
    retry: false,
    // Если ты передаешь в enabled значение false, запрос не будет выполнен автоматически.
    enabled: Boolean(refresh) && navigator.onLine,
  });

  useEffect(() => {
    if (data && data.data) setUser(data.data);
  }, [data]);

  return {
    user,
    isLoading,
    error,
  };
};

export default getUserMethods;
