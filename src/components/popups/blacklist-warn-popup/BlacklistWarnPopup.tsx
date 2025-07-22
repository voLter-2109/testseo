import { FC } from 'react';

import Popup from '../../../ui/popup/Popup';

import CustomButton from '../../../ui/custom-button/Button';

import CrossBtn from '../../../ui/cross-button/CrossBtn';

import style from './BlacklistWarnPopup.module.scss';

interface BlacklistWarnPopupProps {
  isOpen: boolean;
  onClose: () => void;
  confirmAddToBL: (answer: boolean) => void;
}

const BlacklistWarnPopup: FC<BlacklistWarnPopupProps> = ({
  isOpen,
  onClose,
  confirmAddToBL,
}) => {
  const handleApprove = () => {
    try {
      confirmAddToBL(true);
    } finally {
      onClose();
    }
  };

  const handleCancel = () => {
    try {
      confirmAddToBL(false);
    } finally {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <Popup
          extraClass={style.blackListWarnPopup}
          onClose={onClose}
          isOpen={isOpen}
        >
          <CrossBtn onClick={onClose} />
          <div className={style.dialog}>
            <p className={style.warn}>
              Если вы заблокируете пользователя, то он не сможет с вами
              созваниваться и обмениваться сообщениями. Продолжить?
            </p>
            <div className={style.controls}>
              <CustomButton
                styleBtn="secondary"
                classNameBtn={style.ok}
                textBtn="Подтвердить"
                onClick={handleApprove}
              />
              <CustomButton
                styleBtn="red"
                classNameBtn={style.cancel}
                textBtn="Отклонить"
                onClick={handleCancel}
              />
            </div>
          </div>
        </Popup>
      )}
    </>
  );
};

export default BlacklistWarnPopup;
