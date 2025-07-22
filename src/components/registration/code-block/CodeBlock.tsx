import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import classNames from 'classnames';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { PinInput } from 'react-input-pin-code';
import { useNavigate } from 'react-router';

import { setTokens } from '../../../api/apiService';
import { getAuthToken } from '../../../api/auth/auth';
import useWindowResize from '../../../hooks/useWindowResize';
import InputErrorMessage from '../../../ui/inputs/error-message/InputErrorMessage';
import CustomTitle from '../../../ui/title/CustomTitle';
import ResendCode from '../resend-code/ResendCode';

import { SIGN_IN_SUCCESSFUL_MESSAGE } from '../../../constant/infoTooltipMessages';

import { ServerResponseError } from '../../../types/api/serverResponse';

import {
  QKEY_GET_AUTH_TOKEN,
  QKEY_GET_USER,
} from '../../../constant/querykeyConstants';

import style from './codeBlock.module.scss';

type CodeBlockProps = {
  phoneNumber: string;
  handleResetPhoneNumber: () => void;
};

const CodeBlock: FC<CodeBlockProps> = ({
  phoneNumber,
  handleResetPhoneNumber,
}) => {
  console.log('перерисовка CodeBlock');

  const initialInput = ['', '', '', ''];

  const [valuesInput, setValuesInput] = useState<string[]>(initialInput);
  const [errors, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { mobileL } = useWindowResize();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // при новом вводе убираем ошибку
  const handleChangeInputs = useCallback(
    (value: string | string[], index: number, values: string[]) => {
      setError(false);
      return setValuesInput(values);
      console.log(value);
      console.log(index);
    },
    []
  );

  // функция запуска пуш уведомления
  const notifySuccess = () => toast.success(SIGN_IN_SUCCESSFUL_MESSAGE);
  const notifyError = (text: string) => toast.error(text);

  const mutation = useMutation({
    mutationKey: [QKEY_GET_AUTH_TOKEN],
    mutationFn: (data: string) => {
      return getAuthToken({
        phone_number: phoneNumber,
        code: data,
      });
    },
    onSuccess(res) {
      // получили токены, надо сохранить в куки, переход либо через провайдер, либо напрямую перенаправить?
      setTokens(res.data.access, res.data.refresh);
      // при получении токенов ревадириуем запрос на получение юзера
      queryClient.invalidateQueries({
        queryKey: [QKEY_GET_USER],
      });
      notifySuccess();
      if (mobileL) {
        navigate('/m', { replace: true });
      } else navigate('/', { replace: true });
    },
    onError(error: AxiosError<ServerResponseError>) {
      setError(true);
      const errorResponse = error.response?.data.message;
      if (errorResponse) setErrorMessage(errorResponse);

      notifyError(error.message);
    },
  });

  useEffect(() => {
    // проверка что длинна из чисел равна 4, только тогда совершаем запрос иначе зациклится
    if (valuesInput.join('').length === 4) {
      mutation.mutate(valuesInput.join(''));
    }
  }, [valuesInput]);

  return (
    <div className={style.wrapper}>
      <CustomTitle extraClassNames={style.formTitle}>Ваш код</CustomTitle>
      <div className={style.instruction}>
        <p>
          На указанный номер <span> {phoneNumber} </span>
          <br /> отправлено SMS с кодом подтверждения.
          <br /> Введите его в поле ниже.
        </p>
      </div>
      <div className={style.pinBlock}>
        <PinInput
          disabled={mutation.isPending}
          values={valuesInput}
          validate={errors ? 'qweqweqwe' : undefined}
          autoFocus
          inputMode="numeric"
          placeholder=""
          onChange={handleChangeInputs}
          inputClassName={classNames(style.pinCode)}
        />
        <InputErrorMessage
          extraClassName={style.errorMessage}
          errorMessage={errorMessage}
        />
      </div>
      <ResendCode phoneNumber={phoneNumber} />
      <div onClick={handleResetPhoneNumber} className={style.changeNumber}>
        <span>Ввести другой номер телефона</span>
      </div>
    </div>
  );
};

export default memo(CodeBlock);
