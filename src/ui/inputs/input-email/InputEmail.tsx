import React, { FC, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import useYapErrorMessage from '../../../hooks/useYapErrorMessage';
import ClearFieldBtn from '../clear-filed-btn/ClearFieldBtn';

import { IDefaultFormProps } from '../../../components/form/test.type';
import Input from '../main-input/MainInput';

interface IInputText extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  requiredLabel?: boolean;
  name: 'user.email';
}

const InputEmail: FC<IInputText> = ({
  name,
  label,
  requiredLabel,
  ...InputHTMLAttributes
}) => {
  const {
    register,
    formState: { errors, defaultValues },
    trigger,
    watch,
    setValue,
    setFocus,
    unregister,
  } = useFormContext<IDefaultFormProps>();
  const errorMessage = useYapErrorMessage(errors, name);

  const isInputValue = watch(name);

  const handleChange = async () => {
    await trigger(name);
  };

  const handleBlur = useCallback(
    async (event: React.FocusEvent<HTMLInputElement>) => {
      event.target.value = event.target.value.trim();
      await trigger(name);
    },
    [trigger]
  );

  const handleResetVale = async () => {
    setValue(name, '', { shouldValidate: false });
    setFocus(name);
    await trigger(name);
  };

  useEffect(() => {
    return () => {
      unregister(name, { keepIsValid: true });
    };
  }, []);

  return (
    <>
      <Input
        registerOptions={register(name, {
          onChange: handleChange,
          onBlur: handleBlur,
          pattern: {
            message: 'Invalid email address',
            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          },
        })}
        labelText={label}
        requiredLabel={requiredLabel}
        errorMessage={errorMessage}
        name={name}
        defaultValue={defaultValues && `defaultValues${name}`}
        type="text"
        id={name}
        {...InputHTMLAttributes}
        afterChunk={
          isInputValue ? <ClearFieldBtn onClick={handleResetVale} /> : null
        }
      />
    </>
  );
};

export default InputEmail;
