import React, { FC, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import useYapErrorMessage from '../../../hooks/useYapErrorMessage';
import ClearFieldBtn from '../clear-filed-btn/ClearFieldBtn';

import { IDefaultFormProps } from '../../../components/form/test.type';
import {
  INCORRECT_NAME_ERROR,
  REQUIRED_TEXT,
} from '../../../constant/infoTooltipMessages';
import Input from '../main-input/MainInput';

interface IInputText extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  requiredLabel?: boolean;
  name: 'user.first_name' | 'user.last_name' | 'user.patronymic';
  onValidating?: boolean;
}

const InputText: FC<IInputText> = ({
  name,
  label,
  onValidating = true,
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

  const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const v = event.target.value;
    let isValue = v;
    const hyphen = isValue.search('-');
    const valueTrim = isValue.trim().split(/\s*[-\s]\s*/);

    if (hyphen > 0) isValue = valueTrim.join('-');
    else isValue = valueTrim.join(' ');

    if (isValue !== v) {
      setValue(name, isValue);
      await trigger(name);
    }
  };

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
          required: requiredLabel ? REQUIRED_TEXT : false,
          onChange: handleChange,
          onBlur: handleBlur,
          pattern: onValidating
            ? {
                // value: /^([а-яА-Я]+([- ][а-яА-Я]+)?)$/,
                value: /^\s*([а-яА-Я]+)(?:\s*[-\s]\s*([а-яА-Я]+))?\s*$/,
                message: INCORRECT_NAME_ERROR,
              }
            : undefined,
          minLength: onValidating
            ? {
                value: 2,
                message: 'Минимальная длина 2 символа',
              }
            : undefined,
          maxLength: onValidating
            ? {
                value: 50,
                message: 'Максимальная длина 50 символов',
              }
            : undefined,
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

export default InputText;
