import React, { FC, memo, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useHookFormMask } from 'use-mask-input';

import { ReactComponent as Flag } from '../../../assets/registration-page/ru.svg';
import {
  INCORRECT_PHONE_NUMBER,
  REQUIRED_TEXT,
} from '../../../constant/infoTooltipMessages';
import useYapErrorMessage from '../../../hooks/useYapErrorMessage';
import ClearFieldBtn from '../clear-filed-btn/ClearFieldBtn';
import Input from '../main-input/MainInput';

import { TypeFormRegistrationPage } from '../../../api/auth/auth.type';

import style from './inputForPhoneNumber.module.scss';

interface IInputForPhone extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultValue?: string;
  requiredLabel?: boolean;
  label?: string;
  flag?: boolean;
  name: 'phone_number';
}

const InputForPhoneNumber: FC<IInputForPhone> = ({
  label,
  requiredLabel,
  flag,
  name,
  ...InputHTMLAttributes
}) => {
  console.log('перерисовка InputForPhoneNumber');
  const {
    register,
    formState: { errors, defaultValues },
    trigger,
    watch,
    setValue,
    unregister,
    setFocus,
  } = useFormContext<TypeFormRegistrationPage>();
  const errorMessage = useYapErrorMessage(errors, name);
  const registerWithMask = useHookFormMask(register);

  const isInputValue = watch(`${name}`);

  const handleBlur = useCallback(
    async (event: React.FocusEvent<HTMLInputElement>) => {
      event.target.value = event.target.value.trim();
      await trigger(name);
    },
    [trigger]
  );

  const handleResetVale = useCallback(async () => {
    setValue(name, '', { shouldValidate: false });
    setFocus(name);
    await trigger(name);
  }, [trigger]);

  const handleChange = useCallback(
    async (e: string) => {
      // @ts-ignore prefer-destruction
      let { value } = e.target;

      // Если номер начинается с "8", заменить на "+7"
      if (value.startsWith('8')) {
        value = `+7${value.slice(1)}`;
      }

      return value;
    },
    [trigger]
  );

  useEffect(() => {
    return () => {
      unregister(name, { keepIsValid: true });
    };
  }, []);

  return (
    <>
      <Input
        registerOptions={registerWithMask(`${name}`, ['+7 (999) 999-99-99'], {
          onChange(e: string) {
            handleChange(e);
          },
          onBlur: handleBlur,
          required: REQUIRED_TEXT,
          pattern: {
            value: /\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}/,
            message: INCORRECT_PHONE_NUMBER,
          },
        })}
        labelText={label}
        placeholder="+7 (XXX) XXX XX XX"
        errorMessage={errorMessage}
        name={name}
        autoComplete="tel"
        requiredLabel={requiredLabel}
        defaultValue={defaultValues && defaultValues[name]}
        type="tel"
        id={name}
        {...InputHTMLAttributes}
        afterChunk={
          isInputValue ? <ClearFieldBtn onClick={handleResetVale} /> : null
        }
        beforeChunk={<div className={style.country}>{flag && <Flag />}</div>}
      />
    </>
  );
};

export default memo(InputForPhoneNumber);
