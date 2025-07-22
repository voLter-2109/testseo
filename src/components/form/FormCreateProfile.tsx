import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { FC, PropsWithChildren, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

import CustomButton from '../../ui/custom-button/Button';

import style from './form.module.scss';
import { IDefaultFormProps } from './test.type';

interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
  className?: string;
  isLoadingBtn?: boolean;
  isInputEmpty?: boolean;
  submitTextForBtn?: string;
  schema: yup.AnyObjectSchema | undefined;
  successCheckNickName?: boolean;
  isDefaultSubmitBtnHidden?: boolean;
  defaultValuesForm?: IDefaultFormProps;
  onHandleSubmit: (data: any, def: Record<string, any>) => void;
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
 */
const FormCreateProfile: FC<PropsWithChildren<FormProps>> = ({
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
  const methods = useForm<IDefaultFormProps>({
    mode,
    criteriaMode: 'firstError',
    reValidateMode,
    resolver: schema ? yupResolver(schema) : undefined,
    defaultValues: defaultValuesForm,
  });

  const {
    isValid,
    errors,
    // isDirty, isValidating,
    defaultValues,
  } = methods.formState;

  const isFormValid = useCallback(() => {
    if (!errors.user?.nickname && isValid && successCheckNickName) return true;
    return false;
  }, [isValid, errors, successCheckNickName]);

  const { watch, handleSubmit } = methods;

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log(value, name, type);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    // console.log('isValid', isValid);
    console.log('errors', errors);
    console.log('defaultValues', defaultValues);
  }, [isValid, errors, defaultValues, successCheckNickName]);

  return (
    <FormProvider {...methods}>
      <form
        className={classNames(className)}
        onSubmit={handleSubmit((data) => {
          const def = defaultValues || {};
          return onHandleSubmit(data, def);
        })}
        {...FormHTMLAttributes}
      >
        {children}
        {!isDefaultSubmitBtnHidden && (
          <CustomButton
            classNameBtn={style.formShadow}
            disabled={!isFormValid()}
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

export default FormCreateProfile;
