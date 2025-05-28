import { useMutation } from '@tanstack/react-query';
import classNames from 'classnames';
import { FC, useContext } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { ThemeContext } from '../../../providers/ThemeProvider';
import Popup from '../../../ui/popup/Popup';

import { ReactComponent as Cross } from '../../../assets/create-profile/cross.svg';
import CustomButton from '../../../ui/custom-button/Button';

import askSupportService from '../../../api/serivce/service';
import useYapErrorMessage from '../../../hooks/useYapErrorMessage';
import InputErrorMessage from '../../../ui/inputs/error-message/InputErrorMessage';

import useUserStore from '../../../store/userStore';
import { CreatedSupportMessage } from '../../../types/service/service';
import style from './servicePopup.module.scss';

interface ServicePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ServicePopup: FC<ServicePopupProps> = ({ isOpen, onClose }) => {
  const theme = useContext(ThemeContext);
  const user = useUserStore((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatedSupportMessage>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      email: user?.email || '',
      text: '',
    },
  });

  const errorMessageEmail = useYapErrorMessage(errors, 'email');
  const errorMessageText = useYapErrorMessage(errors, 'text');

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
            <Cross
              className={classNames(style.btn_svg, {
                [style.lightTheme]: theme?.theme === 'dark',
              })}
              onClick={onClose}
            />
          </div>

          <form
            className={style.serviceForm}
            onSubmit={handleSubmit((data) => {
              onSubmit(data);
            })}
          >
            <label htmlFor="email">
              Ваш почтовый адрес:
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errorMessageEmail && (
                <InputErrorMessage errorMessage={errorMessageEmail} />
              )}
            </label>

            <label htmlFor="text">
              Текст сообщения:
              <textarea
                id="text"
                rows={4}
                {...register('text', {
                  required: 'Text is required',
                })}
              />
              {errorMessageText && (
                <InputErrorMessage errorMessage={errorMessageText} />
              )}
            </label>
            <CustomButton
              type="submit"
              styleBtn="secondary"
              classNameBtn={style.ok}
              textBtn="Отправить"
            />
            {isPending && <p>Sending your request...</p>}
          </form>
        </Popup>
      )}
    </>
  );
};

export default ServicePopup;
