import { useMutation } from '@tanstack/react-query';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import React, { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { checkUniqueNickname } from '../../../api/user/user';
import { REQUIRED_TEXT } from '../../../constant/infoTooltipMessages';
import useYapErrorMessage from '../../../hooks/useYapErrorMessage';
import { ServerResponseError } from '../../../types/api/serverResponse';
import ClearFieldBtn from '../clear-filed-btn/ClearFieldBtn';
import Input from '../main-input/MainInput';

import { QKEY_CHECK_NICKNAME } from '../../../constant/querykeyConstants';

import { IDefaultFormProps } from '../../../components/form/test.type';

import style from './inputNickName.module.scss';

interface IInputText extends React.InputHTMLAttributes<HTMLInputElement> {
  name: 'user.nickname';
  label?: string;
  requiredLabel?: boolean;
  successCheckNickName: boolean;
  setSuccessCheckNickName: Dispatch<SetStateAction<boolean>>;
}

const InputNickName: FC<IInputText> = ({
  name,
  label,
  requiredLabel,
  successCheckNickName,
  setSuccessCheckNickName,
  ...InputHTMLAttributes
}) => {
  const {
    register,
    formState: { errors, defaultValues },
    watch,
    setFocus,
    setError,
    setValue,
    clearErrors,
    trigger,
  } = useFormContext<IDefaultFormProps>();
  const errorMessage = useYapErrorMessage(errors, name);

  const isInputValue = Boolean(watch(name));

  useEffect(() => {
    console.log('isInputValue', isInputValue);
  }, [isInputValue]);

  const handleResetVale = async () => {
    setValue(name, defaultValues?.user?.nickname || '', {
      shouldValidate: true,
    });
    setFocus(name);
    await trigger(name);
  };

  const { mutate, isPending } = useMutation({
    mutationKey: [QKEY_CHECK_NICKNAME],
    mutationFn: (e: string) => {
      return checkUniqueNickname(e);
    },
    onError: (e: ServerResponseError) => {
      const { detail } = e.response.data;
      console.log(e.response);
      console.log(e);
      setError(name, {
        type: 'server',
        message: detail,
      });
    },
    onSuccess: () => {
      setSuccessCheckNickName(true);
      clearErrors([name]);
    },
  });

  const checkNickName = useMemo(
    () =>
      debounce((e: string) => {
        mutate(e);
      }, 700),

    []
  );

  const handleChange = async () => {
    setSuccessCheckNickName(false);
    await trigger(name);
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const def = defaultValues ? defaultValues.user?.nickname : '';
    if (def !== e.target.value && !errorMessage) {
      checkNickName(e.target.value);
    } else {
      setSuccessCheckNickName(true);
    }
  };

  // useEffect(() => {
  //   return () => {
  //     unregister(name, { keepIsValid: true });
  //   };
  // }, []);

  return (
    <>
      <Input
        registerOptions={register(name, {
          onChange: handleChange,
          onBlur: (e) => {
            if (e.target.value) handleBlur(e);
          },
          disabled: isPending,
          pattern: {
            value: /^[a-zA-Z0-9._]+$/,
            message:
              'Допустимые символы a до z от A до Z, от 0 до 9, точка и знак подчеркивания',
          },
          required: REQUIRED_TEXT,
          minLength: { value: 6, message: 'минимальная длина 6 символов' },
          maxLength: { value: 20, message: 'максимальная длинна 20 символов' },
        })}
        labelText={label}
        extraWrapperClassName={classNames({
          [style.success]: successCheckNickName,
        })}
        requiredLabel={requiredLabel}
        errorMessage={errorMessage}
        name={name}
        defaultValue={defaultValues && `defaultValues${name}`}
        type="text"
        id={name}
        {...InputHTMLAttributes}
        afterChunk={
          isInputValue ? (
            <ClearFieldBtn
              textLabel="значение по умолчанию"
              disabled={InputHTMLAttributes.disabled}
              onClick={handleResetVale}
            />
          ) : null
        }
      />
    </>
  );
};

export default InputNickName;
