import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FC } from 'react';
import toast from 'react-hot-toast';

import { getConfirmationCode } from '../../../api/auth/auth';
import useTimer from '../../../hooks/useTimer';
import { ServerResponseError } from '../../../types/api/serverResponse';
import timerFormat from '../../../utils/timerFormat';

import { GET_CONFIRMATION_CODE } from '../../../constant/querykeyConstants';

import style from './ResendCode.module.scss';

interface ResendCodeProps {
  phoneNumber: string;
}

const ResendCode: FC<ResendCodeProps> = ({ phoneNumber }) => {
  const { time, reloadTimer } = useTimer(60);

  const notifyError = (text: string) => toast.error(text);

  // ! тут надо замeнить на invalidate
  const { mutate } = useMutation({
    mutationKey: [GET_CONFIRMATION_CODE, phoneNumber],
    mutationFn: () => {
      return getConfirmationCode({
        phone_number: phoneNumber,
      });
    },
    onSuccess: () => {
      reloadTimer();
    },

    onError: (error: AxiosError<ServerResponseError>) => {
      const errorResponse = error.response?.data.message;
      // сделать reactPortal для вывода ошибок
      if (errorResponse) {
        notifyError(errorResponse);
      }
      console.log(error);
    },
  });

  const handleResend = () => {
    mutate();
  };

  return (
    <p className={style.content}>
      {time > 0 ? (
        <span className={style.text}>
          Отправить код повторно через {timerFormat(time)}
        </span>
      ) : (
        <span className={style.link} onClick={handleResend}>
          Отправить код повторно
        </span>
      )}
    </p>
  );
};

export default ResendCode;
