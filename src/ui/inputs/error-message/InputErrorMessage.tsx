import { FC, memo } from 'react';

import classNames from 'classnames';

import styles from './inputErrorMessage.module.scss';

interface ErrorMessageProps {
  errorMessage: string | null;
  extraClassName?: string;
}

/**
 *
 * @param errorMessage текст ошибки
 * @returns вывод ошибки со стилями
 */

const InputErrorMessage: FC<ErrorMessageProps> = ({
  errorMessage = '',
  extraClassName,
}) => {
  console.log('перерисовка InputErrorMessage');
  return errorMessage ? (
    <span className={classNames(styles.error, extraClassName)}>
      {errorMessage}
    </span>
  ) : null;
};

export default memo(InputErrorMessage);
