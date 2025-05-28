import { useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { FC, memo, useCallback } from 'react';

import { ReactComponent as Exit } from '../../assets/side-menu/exit.svg';
import useHandleLogout from '../../hooks/useHandleLogout';
import CustomButton from '../custom-button/Button';

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
  console.log('перерисовка ExitButton');
  const { handleLogout } = useHandleLogout();
  const queryClient = useQueryClient();

  const handleClickLogOut = useCallback(() => {
    queryClient.clear();
    handleLogout();
  }, [handleLogout, queryClient]);

  return (
    <CustomButton
      style={styleAtr}
      classNameBtn={classNames(style.exit, classNameBtn)}
      styleBtn={styleBtn}
      onClick={handleClickLogOut}
    >
      <Exit
        className={classNames({
          [style.red]: styleBtn === 'red',
          [style.blue]: styleBtn === 'blue',
        })}
      />
      {showText && <span>Выход</span>}
    </CustomButton>
  );
};

export default memo(ExitButton);
