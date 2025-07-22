import classNames from 'classnames';
import React, { FC, memo } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import InputErrorMessage from '../error-message/InputErrorMessage';
import Label from '../label/Label';

import style from './mainInput.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
  requiredLabel?: boolean;
  extraInputClassName?: string;
  errorMessage?: string | null;
  extraLabelClassNames?: string;
  extraWrapperClassName?: string;
  afterChunk?: JSX.Element | null;
  beforeChunk?: JSX.Element | null;
  extraAfterChunkClassName?: string;
  extraBeforeChunkClassName?: string;
  ref?: React.RefObject<HTMLInputElement>;
  registerOptions?: UseFormRegisterReturn;
}

/**
 * @description label
 * @param labelText - что написать
 * @param requiredLabel - обязательно поле
 * @param extraLabelClassNames - дополнительные стили
 *
 * @param  registerOptions - register in react hook form
 * @param  extraInputClassName
 * @param  caption - вставляем JSX.Element в конец input
 * @returns
 *
 * @param errorMessage - вывести текст ошибки input так же подсвечивается
 *
 * @param afterChunk - что вывести справа в input , можно использовать ClearBtm
 * @param extraAfterChunkClassName - дополнительные стили

 * @param beforeChunk - что вывести слева в input
 * @param extraBeforeChunkClassName - дополнительные стили
 *
 * @param extraWrapperClassName дополнительные стили к главному wrapper
 */
const Input: FC<InputProps> = ({
  labelText,
  afterChunk,
  beforeChunk,
  errorMessage,
  requiredLabel,
  registerOptions,
  extraInputClassName,
  extraLabelClassNames,
  extraWrapperClassName,
  extraAfterChunkClassName,
  extraBeforeChunkClassName,
  ...HTMLInputElement
}) => {
  return (
    <div className={style.wrapper}>
      {labelText && (
        <Label
          label={labelText}
          required={requiredLabel}
          extraLabelClass={extraLabelClassNames}
        />
      )}
      <div
        className={classNames(style.wrapperInput, extraWrapperClassName, {
          [style.error]: errorMessage,
        })}
      >
        {beforeChunk ? (
          <div className={classNames(style.before, extraBeforeChunkClassName)}>
            {beforeChunk}
          </div>
        ) : null}
        <input
          id={HTMLInputElement.id}
          {...registerOptions}
          className={classNames(style.input, extraInputClassName)}
          {...HTMLInputElement}
        />
        {afterChunk ? (
          <div className={classNames(style.after, extraAfterChunkClassName)}>
            {afterChunk}
          </div>
        ) : (
          <div className={classNames(style.after)} />
        )}
      </div>
      {errorMessage ? (
        <InputErrorMessage errorMessage={errorMessage} />
      ) : (
        <div className={style.errorMessage} />
      )}
    </div>
  );
};

export default memo(Input);
