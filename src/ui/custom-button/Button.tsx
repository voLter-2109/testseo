import classNames from 'classnames';
import {
  ButtonHTMLAttributes,
  FC,
  memo,
  PropsWithChildren,
  useMemo,
} from 'react';

import Spinner from '../spinner/Spinner';

import styles from './button.module.scss';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  textBtn?: string;
  type?: 'button' | 'submit';
  isLoading?: boolean;
  styleBtn?: 'primary' | 'secondary' | 'blue' | 'red' | 'formShadow';
  classNameBtn?: string;
}

/**
 * @property {string} textBtn? текст кнопки
 * @property {boolean} isLoading? показывать спиннер?
 * @property {boolean} isDisable? условие disabled
 * @property {styleBtn} styleBtn? стиль кнопки 'primary' | 'secondary' | 'blue' | 'red' | 'formShadow'
 * @property {classNameBtn} classNameBtn? дополнительные стили
 */
const CustomButton: FC<PropsWithChildren<CustomButtonProps>> = (props) => {
  const {
    classNameBtn,
    textBtn = 'Далее',
    children,
    style: addStyle,
    isLoading = false,
    styleBtn = 'primary',
    type = 'button',
    ...HTMLButtonElement
  } = props;
  const buttonClassName = useMemo(
    () =>
      classNames(styles.button, addStyle, classNameBtn, {
        [styles.primary]: styleBtn === 'primary',
        [styles.secondary]: styleBtn === 'secondary',
        [styles.blue]: styleBtn === 'blue',
        [styles.red]: styleBtn === 'red',
      }),
    [classNameBtn, styleBtn]
  );
  // console.log('перерисовка CustomButton', classNameBtn);
  return (
    <button
      disabled={HTMLButtonElement.disabled || isLoading}
      className={buttonClassName}
      type={type === 'submit' ? 'submit' : 'button'}
      {...HTMLButtonElement}
    >
      {isLoading ? (
        <div className={styles.container}>
          <Spinner /> <span>{textBtn}</span>
        </div>
      ) : (
        children || textBtn
      )}
    </button>
  );
};

export default memo(CustomButton);
