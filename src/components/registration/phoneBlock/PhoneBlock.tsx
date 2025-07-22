/* eslint-disable @typescript-eslint/naming-convention */

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FC, memo, useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { getConfirmationCode } from '../../../api/auth/auth';
import {
  TypeFormRegistrationPage,
  TypeGetConfirmationCode,
} from '../../../api/auth/auth.type';
import useWindowResize from '../../../hooks/useWindowResize';
import { ServerResponseError } from '../../../types/api/serverResponse';
import InputForPhoneNumber from '../../../ui/inputs/input-for-phone-number/InputForPhoneNumber';
import InputCheckboxPolicy from '../../../ui/inputs/input-type-checkbox-policy/InputTypeCheckboxPolicy';
import CustomTitle from '../../../ui/title/CustomTitle';
import phonePageSchema from '../../../validation/phone-page-schema/form-phone-number-schema';
import Form from '../../form/Form';

import { PERSONAL_DATA_AGREEMENT } from '../../../constant/documents';
import Popup from '../../../ui/popup/Popup';

import CustomButton from '../../../ui/custom-button/Button';

import { GET_CONFIRMATION_CODE } from '../../../constant/querykeyConstants';

import style from './PhoneBlock.module.scss';

type TPhoneBlockProps = {
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  phoneNumber: string;
};

interface IPolicePopUp {
  openModal: boolean;
  closeModal: () => void;
}

export const PolicePopUp: FC<IPolicePopUp> = ({ closeModal, openModal }) => {
  console.log('перерисовка PolicePopUp');
  return (
    <>
      {openModal && (
        <Popup isOpen={openModal} onClose={closeModal} extraClass={style.modal}>
          {PERSONAL_DATA_AGREEMENT}
          <div className={style.closeBtn}>
            <CustomButton onClick={closeModal}>Закрыть</CustomButton>
          </div>
        </Popup>
      )}
    </>
  );
};

const PhoneBlock: FC<TPhoneBlockProps> = ({
  setTrigger,
  setPhoneNumber,
  phoneNumber,
}) => {
  console.log('перерисовка PhoneBlock');

  const { mobileL } = useWindowResize();
  const notifyError = (text: string) => toast.error(text);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const toggleViewPolicePopUp = useCallback(() => {
    setOpenModal((prev) => !prev);
  }, []);

  const { mutate, isPending } = useMutation({
    mutationKey: [GET_CONFIRMATION_CODE, phoneNumber],
    mutationFn: (data: TypeGetConfirmationCode) => {
      const telNumber = data.phone_number.replace(/[\s()-]/g, '');
      return getConfirmationCode({
        phone_number: telNumber,
      });
    },
    onSuccess(res) {
      setPhoneNumber(res.data.phone_number);
      setTrigger((prev) => !prev);
    },

    onError: (error: AxiosError<ServerResponseError>) => {
      const errorResponse = error.response?.data.message;
      if (errorResponse) {
        notifyError(errorResponse);
      }
      notifyError(error.message);
    },
  });

  const handleSubmit = useCallback(
    (data: TypeFormRegistrationPage) => {
      const { phone_number } = data;
      mutate({ phone_number });
    },
    [useMutation]
  );

  return (
    <>
      {openModal && (
        <PolicePopUp closeModal={toggleViewPolicePopUp} openModal={openModal} />
      )}
      <Form
        onHandleSubmit={handleSubmit}
        isLoadingBtn={isPending}
        reValidateMode="onSubmit"
        className={style.form}
        submitTextForBtn="Далее"
        mode="onBlur"
        schema={phonePageSchema}
      >
        <CustomTitle extraClassNames={style.title}>
          Вход / Регистрация
        </CustomTitle>
        <InputForPhoneNumber
          flag
          tabIndex={0}
          name="phone_number"
          label="Введите номер телефона"
          requiredLabel
        />

        <InputCheckboxPolicy name="is_conf_policy_accepted" tabIndex={0}>
          <p>
            Я принимаю условия{' '}
            <span style={{ color: 'var(--red-primary)' }}>*</span>
          </p>
          <button
            type="button"
            className={style.policeButton}
            onClick={toggleViewPolicePopUp}
          >
            {mobileL ? 'Польз. соглашение' : 'Пользовательское соглашение'}
          </button>
        </InputCheckboxPolicy>
      </Form>
    </>
  );
};

export default memo(PhoneBlock);
