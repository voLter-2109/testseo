import React, { FC, TextareaHTMLAttributes, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Label from '../label/Label';

import style from './customTextarea.module.scss';

interface InputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  requiredLabel?: boolean;
  name: string;
}

const CustomTextarea: FC<InputProps> = ({
  name,
  label,
  requiredLabel,
  ...HTMLTextAreaElement
}) => {
  const {
    trigger,
    register,
    unregister,
    formState: { defaultValues },
  } = useFormContext();

  const handleBlur = async (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.currentTarget.value = e.currentTarget.value.trim();
    await trigger(name);
  };

  useEffect(() => {
    return () => {
      unregister(name, { keepIsValid: true });
    };
  }, []);

  return (
    <div className={style.wrapper}>
      {label && <Label label={label} required={requiredLabel} />}
      <div className={style.wrapperInput}>
        <textarea
          {...register(name, {
            onBlur: (e) => handleBlur(e),
          })}
          defaultValue={defaultValues && defaultValues[name]}
          className={style.textarea}
          {...HTMLTextAreaElement}
        />
      </div>
    </div>
  );
};

export default CustomTextarea;
