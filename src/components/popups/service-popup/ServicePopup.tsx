import { useMutation } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Popup from '../../../ui/popup/Popup';

import CustomButton from '../../../ui/custom-button/Button';

import askSupportService from '../../../api/serivce/service';
import useYapErrorMessage from '../../../hooks/useYapErrorMessage';

import useUserStore from '../../../store/userStore';
import { CreatedSupportMessage } from '../../../types/service/service';

import { REQUIRED_TEXT } from '../../../constant/infoTooltipMessages';
import ClearFieldBtn from '../../../ui/inputs/clear-filed-btn/ClearFieldBtn';
import Input from '../../../ui/inputs/main-input/MainInput';

import CrossBtn from '../../../ui/cross-button/CrossBtn';
import InputErrorMessage from '../../../ui/inputs/error-message/InputErrorMessage';
import Label from '../../../ui/inputs/label/Label';

import style from './servicePopup.module.scss';

enum NameFil {
  EMAIL = 'email',
  TEXT = 'text',
}

interface ServicePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ServicePopup: FC<ServicePopupProps> = ({ isOpen, onClose }) => {
  const user = useUserStore((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    setFocus,
    watch,
  } = useForm<CreatedSupportMessage>({
    mode: 'all',
    reValidateMode: 'onSubmit',
    defaultValues: {
      email: user?.email || '',
      text: '',
    },
  });

  const errorMessageEmail = useYapErrorMessage(errors, NameFil.EMAIL);
  const errorMessageText = useYapErrorMessage(errors, NameFil.TEXT);

  const isInputValueEmail = watch(NameFil.EMAIL);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log(value, name, type);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    console.log(isInputValueEmail);
  }, [isInputValueEmail]);

  const notifySuccess = (test: string, dur: number = 2000) =>
    toast.success(test, {
      duration: dur,
      style: {
        minWidth: '350px',
      },
    });
  const notifyError = (text: string) =>
    toast.error(text, {
      duration: 4000,
    });

  const { mutate, isPending } = useMutation({
    mutationKey: ['send service message'],
    mutationFn: (d: CreatedSupportMessage) => {
      return askSupportService(d);
    },
    onSuccess: () => {
      notifySuccess('Ваше обращение отправлено');
      onClose();
    },
    onError: (error) => {
      notifyError(error.message);
    },
  });

  const onSubmit = (data: CreatedSupportMessage) => {
    return mutate(data);
  };

  const handleResetVale = async (n: NameFil) => {
    setValue(n, '', { shouldValidate: false });
    setFocus(n);
    await trigger(n);
  };

  return (
    <>
      {isOpen && (
        <Popup
          extraClass={style.servicePopup}
          onClose={onClose}
          isOpen={isOpen}
        >
          <div className={style.serviceFormPopup}>
            <h3 className={style.serviceFormHeader}>
              Обращение в службу поддержки:
            </h3>
            <CrossBtn onClick={onClose} />
          </div>

          <form
            className={style.serviceForm}
            onSubmit={handleSubmit((data) => {
              onSubmit(data);
            })}
          >
            <Input
              registerOptions={register(NameFil.EMAIL, {
                required: REQUIRED_TEXT,
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Неверный формат',
                },
              })}
              labelText="Ваш почтовый адрес:"
              requiredLabel
              errorMessage={errorMessageEmail}
              name={NameFil.EMAIL}
              type="text"
              id={NameFil.EMAIL}
              afterChunk={
                isInputValueEmail ? (
                  <ClearFieldBtn
                    onClick={() => handleResetVale(NameFil.EMAIL)}
                  />
                ) : null
              }
            />
            <div className={style.wrapper}>
              <Label label="Текст сообщения:" required />
              <div className={style.wrapperInput}>
                <textarea
                  className={style.textarea}
                  id={NameFil.TEXT}
                  rows={4}
                  {...register(NameFil.TEXT, {
                    required: 'Text is required',
                  })}
                />
              </div>
              {errorMessageText && (
                <InputErrorMessage errorMessage={errorMessageText} />
              )}
            </div>

            <CustomButton
              type="submit"
              styleBtn="secondary"
              classNameBtn={style.ok}
              textBtn="Отправить"
            />
            {errorMessageText && (
              <InputErrorMessage errorMessage={errorMessageText} />
            )}
            {isPending && <p>Sending your request...</p>}
          </form>
        </Popup>
      )}
    </>
  );
};

export default ServicePopup;
