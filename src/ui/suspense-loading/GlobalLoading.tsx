import { FC } from 'react';

import Spinner from '../spinner/Spinner';

import style from './globalLoading.module.scss';

/**
 *
 * @returns страница с загрузкой на весь экран
 */
const GlobalLoading: FC = () => {
  return (
    <div className={style.globalLoading}>
      <Spinner size="lg" color="blue" textLoading />
      <div />
    </div>
  );
};

export default GlobalLoading;
