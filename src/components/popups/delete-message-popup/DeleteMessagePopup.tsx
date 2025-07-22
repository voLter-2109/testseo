import { FC } from 'react';

import Popup from '../../../ui/popup/Popup';
import CustomButton from '../../../ui/custom-button/Button';

import style from './deleteMessagePopup.module.scss';

interface DeleteMessagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  handleMessageDelete: () => void;
}

const DeleteMessagePopup: FC<DeleteMessagePopupProps> = ({
  isOpen,
  onClose,
  handleMessageDelete,
}) => {
  return (
    <>
      {isOpen && (
        <Popup extraClass={style.container} onClose={onClose} isOpen={isOpen}>
          <CustomButton
            title="Закрыть"
            textBtn=""
            className={style.cross}
            onClick={onClose}
          />
          <p>Вы действительно хотите удалить сообщение?</p>
          <div className={style.buttons}>
            <CustomButton
              type="button"
              textBtn="Нет"
              styleBtn="primary"
              onClick={onClose}
            />
            <CustomButton
              type="button"
              textBtn="Да"
              styleBtn="secondary"
              onClick={() => {
                handleMessageDelete();
                onClose();
              }}
            />
          </div>
        </Popup>
      )}
    </>
  );
};

export default DeleteMessagePopup;
