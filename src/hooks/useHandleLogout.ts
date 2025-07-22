import { useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

import { removeTokens } from '../api/apiService';
import { SIGN_OUT_SUCCESSFUL_MESSAGE } from '../constant/infoTooltipMessages';
import {
  REGISTRATION_MOBILE_PAGE,
  REGISTRATION_PAGE,
} from '../constant/url-page.constants';
import useUserStore from '../store/userStore';

import useChatListStore from '../store/chatListStore';

import { ThemeContext } from '../providers/ThemeProvider';

import useWindowResize from './useWindowResize';

interface ReturnProps {
  resetSessionStorage: () => void;
  handleLogout: () => Promise<void>;
}

export const useHandleLogout = (): ReturnProps => {
  const queryClient = useQueryClient();
  const resetUserStore = useUserStore((state) => state.resetUserStore);
  const clearStoreChatList = useChatListStore(
    (state) => state.clearStoreChatList
  );
  const theme = useContext(ThemeContext);

  const handleRemoveQuery = () => queryClient.removeQueries;

  const { mobileL } = useWindowResize();
  const navigate = useNavigate();

  // ! задание добавить проверку через промисы
  const resetSessionStorage = () => {
    clearStoreChatList();
    handleRemoveQuery();
    resetUserStore();
    sessionStorage.clear();
  };

  const resetLocalStorage = () => {
    console.log('clear');
    localStorage.clear();
  };

  const handleLogout = async () => {
    try {
      await Promise.all([
        resetSessionStorage(),
        removeTokens(),
        resetLocalStorage(),
      ]).finally(() => {
        if (mobileL) {
          navigate(REGISTRATION_MOBILE_PAGE);
        } else {
          navigate(`/${REGISTRATION_PAGE}`);
        }
        theme?.handleLogOutChangeDEfTheme();
        toast.success(SIGN_OUT_SUCCESSFUL_MESSAGE);
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(`${error}`);
    }
  };

  return { handleLogout, resetSessionStorage };
};

export default useHandleLogout;
