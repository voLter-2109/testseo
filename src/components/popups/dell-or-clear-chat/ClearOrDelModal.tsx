import classNames from 'classnames';
import { FC, memo, useContext } from 'react';

import { ReactComponent as Cross } from '../../../assets/create-profile/cross.svg';
import CustomButton from '../../../ui/custom-button/Button';
import Popup from '../../../ui/popup/Popup';

import { ThemeContext } from '../../../providers/ThemeProvider';

import { PropsDelClearFunc } from '../../../types/menu/menu';

import style from './clearOrDelModal.module.scss';

interface Props {
  isOpen: PropsDelClearFunc;
  onClose: () => void;
  handleFunc: (e: PropsDelClearFunc) => void;
}

const ClearOrDelModal: FC<Props> = ({ isOpen, onClose, handleFunc }) => {
  const theme = useContext(ThemeContext);

  if (!isOpen) return null;

  return (
    <>
      {isOpen && (
        <Popup
          extraClass={style.container}
          onClose={onClose}
          isOpen={Boolean(isOpen)}
        >
          <Cross
            title="закрыть"
            className={classNames(style.btn_svg, {
              [style.lightTheme]: theme?.theme === 'dark',
            })}
            onClick={onClose}
          />
          <div style={{ width: '100%' }}>
            <p className={style.warm}>
              {isOpen.type === 'clear'
                ? 'Вы действительно хотите очистить историю сообщений?'
                : 'Вы действительно хотите удалить чат?'}
            </p>

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
      )}
    </>
  );
};

export default memo(ClearOrDelModal);
