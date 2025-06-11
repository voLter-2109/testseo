import { useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { FC, memo, useCallback, useState } from 'react';

import { useNavigate } from 'react-router';

import { ReactComponent as Exit } from '../../assets/side-menu/exit.svg';
import useHandleLogout from '../../hooks/useHandleLogout';
import CustomButton from '../custom-button/Button';

import YesOrNoModal from '../../components/popups/yes-or-no-popup/YesOrNoModal';

import { PropsYesOrNo, ThemeEnum } from '../../types/menu/menu';

import useWindowResize from '../../hooks/useWindowResize';

import { REGISTRATION_PAGE } from '../../constant/url-page.constants';

import style from './exitButton.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  showText?: boolean;
  classNameBtn?: string;
  styleBtn?: 'secondary' | 'primary' | 'blue' | 'red' | 'formShadow';
}

const ExitButton: FC<Props> = ({
  showText = true,
  classNameBtn,
  styleBtn = 'red',
  ...buttonAtr
}) => {
  const { style: styleAtr } = buttonAtr;
  const { handleLogout } = useHandleLogout();
  const queryClient = useQueryClient();
  const [isQuitModalOpen, setQuitModalOpen] = useState<PropsYesOrNo>(null);
  const navigate = useNavigate();
  const { mobileL } = useWindowResize();

  const handleCloseQuitModal = () => {
    setQuitModalOpen(null);
  };

  const handleOpenQuitModal = () => {
    setQuitModalOpen({
      type: ThemeEnum.QUIT,
      selMes: null,
    });
  };

  const handleClickLogOut = useCallback(() => {
    const path = mobileL ? `/m${REGISTRATION_PAGE}` : REGISTRATION_PAGE;
    navigate(path);
    queryClient.clear();
    handleLogout();
  }, [navigate, mobileL, queryClient, handleLogout]);

  const handleFunc = () => {
    handleClickLogOut();
  };

  return (
    <>
      <CustomButton
        style={styleAtr}
        classNameBtn={classNames(style.exit, classNameBtn)}
        styleBtn={styleBtn}
        onClick={handleOpenQuitModal}
      >
        <Exit
          className={classNames({
            [style.red]: styleBtn === 'red',
            [style.blue]: styleBtn === 'blue',
          })}
        />
        {showText && <span>Выход</span>}
      </CustomButton>

      {isQuitModalOpen && (
        <YesOrNoModal
          handleFunc={handleFunc}
          onClose={handleCloseQuitModal}
          isOpen={isQuitModalOpen}
        />
      )}
    </>
  );
};

export default memo(ExitButton);
