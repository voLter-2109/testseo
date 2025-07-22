import { FC, memo } from 'react';

import CustomButton from '../../../ui/custom-button/Button';
import Popup from '../../../ui/popup/Popup';

import { PropsYesOrNo, YesOrNoMessages } from '../../../types/menu/menu';

import CrossBtn from '../../../ui/cross-button/CrossBtn';

import style from './clearOrDelModal.module.scss';

interface Props {
  isOpen: PropsYesOrNo;
  onClose: () => void;
  handleFunc: (e: PropsYesOrNo) => void;
}

const ClearOrDelModal: FC<Props> = ({ isOpen, onClose, handleFunc }) => {
  if (!isOpen) return null;

  return (
    <>
      <Popup
        extraClass={style.container}
        onClose={onClose}
        isOpen={Boolean(isOpen)}
      >
        <CrossBtn onClick={onClose} />
        <div style={{ width: '100%' }}>
          <p className={style.warm}>{YesOrNoMessages[isOpen.type]}</p>

          <div className={style.controls}>
            <CustomButton
              type="button"
              textBtn="Отменить"
              classNameBtn={style.cancel}
              styleBtn="primary"
              onClick={onClose}
            />
            <CustomButton
              type="button"
              textBtn="Согласен"
              classNameBtn={style.ok}
              styleBtn="secondary"
              onClick={() => {
                handleFunc(isOpen);
                onClose();
              }}
            />
          </div>
        </div>
      </Popup>
    </>
  );
};

export default memo(ClearOrDelModal);
