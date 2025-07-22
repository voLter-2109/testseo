import { FC } from 'react';

import CustomButton from '../../../ui/custom-button/Button';
import Popup from '../../../ui/popup/Popup';
import CustomTitle from '../../../ui/title/CustomTitle';

import style from './userNotFoundPopup.module.scss';

interface UserNotFoundPopupProps {
  isOpen: boolean;
  onClose: () => void;
  uid?: string | null;
}

const UserNotFoundPopup: FC<UserNotFoundPopupProps> = ({
  isOpen,
  onClose,
  uid,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className={style.modal}>
        <CustomTitle>Пользователь не найден</CustomTitle>
        <p>
          Пользователь с идентификатором &quot;{uid}&quot; не зарегистрирован.
        </p>
        <CustomButton textBtn="Закрыть" onClick={onClose} />
      </div>
    </Popup>
  );
};

export default UserNotFoundPopup;
