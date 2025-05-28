import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { FC, memo, PropsWithChildren, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

import CustomButton from '../../ui/custom-button/Button';

import style from './form.module.scss';

interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
  className?: string;
  isLoadingBtn?: boolean;
  isInputEmpty?: boolean;
  submitTextForBtn?: string;
  schema: yup.AnyObjectSchema | undefined;
  successCheckNickName?: boolean;
  isDefaultSubmitBtnHidden?: boolean;
  defaultValuesForm?: Record<string, any> | undefined;
  onHandleSubmit: (data: any, def: any) => void;
  reValidateMode?: 'onBlur' | 'onChange' | 'onSubmit';
  mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all';
}

/**
 * @name CustomForm
 * @param {string} className?
 * @param {boolean} isLoadingBtn? - запуск анимации загрузки на кнопке
 * @param {boolean} isInputEmpty? дополнительное коле для дневника - проверить??
 * @param {string} submitTextForBtn? текст кнопки для отправки данных
 * @param {object} schema? - схема проверки введенных данных
 * @param {boolean} successCheckNickName? - проверка уникальности никнейма
 * @param {Record<string, any>} defaultValuesForm? дефолтные значения формы
 * @param {(data: Record<string, any>) => void} onSubmit? - функция отправки формы
 * @param {enum} reValidateMode? def: 'onBlur' режим повторной проверки формы
 * @param {enum} mode? def:'onChange' основной режим проверки формы
 * @param {string} inputModeValidate? def:'isValid' режим проверки формы
 */
const Form: FC<PropsWithChildren<FormProps>> = ({
  schema,
  onHandleSubmit,
  children,
  className,
  isInputEmpty,
  defaultValuesForm,
  submitTextForBtn,
  mode,
  reValidateMode,
  isLoadingBtn = false,
  isDefaultSubmitBtnHidden,
  successCheckNickName = true,
  ...FormHTMLAttributes
}) => {
  // * заставляет перерисовываться все форму столько раз сколько input внутри
  const methods = useForm({
    mode,
    criteriaMode: 'firstError',
    reValidateMode,
    resolver: schema ? yupResolver(schema) : undefined,
    defaultValues: defaultValuesForm && defaultValuesForm,
  });

  const {
    isValid,
    errors,
    // isDirty,
    // isValidating,
    defaultValues,
  } = methods.formState;

  console.log('перерисовка Form');

  useEffect(() => {
    methods.trigger('control trigger');
    console.log(successCheckNickName);
  }, [defaultValues]);

  // const isFormValid = useCallback(() => {
  //   if (!errors.nickname && successCheckNickName && isValid) {
  //     return isValid;
  //   }
  //   return false;
  // }, [isDirty, isValid, errors, successCheckNickName]);

  const { watch, handleSubmit } = methods;

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log(value, name, type);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    console.log('isValid', isValid);
    // console.log('isDirty', isDirty);
    // console.log('isValidating', isValidating);
    console.log('errors', errors);
    console.log('defaultValues', defaultValues);
  }, [
    errors,
    defaultValues,
    // isValidating,
    isValid,
  ]);

  return (
    <FormProvider {...methods}>
      <form
        className={classNames(className)}
        onSubmit={handleSubmit((data) => {
          console.log(errors);
          const def = defaultValues || {};
          console.log('data', data);
          return onHandleSubmit(data, def);
        })}
        {...FormHTMLAttributes}
      >
        {children}
        {!isDefaultSubmitBtnHidden && (
          <CustomButton
            classNameBtn={style.formShadow}
            // disabled={!isFormValid()}
            isLoading={isLoadingBtn}
            textBtn={submitTextForBtn}
            type="submit"
            styleBtn="secondary"
            tabIndex={0}
          />
        )}
        {/* <DevTool control={methods.control} /> */}
      </form>
    </FormProvider>
  );
};

export default memo(Form);
