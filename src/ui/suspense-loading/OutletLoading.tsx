import { FC } from 'react';

import Spinner from '../spinner/Spinner';

import style from './globalLoading.module.scss';

/**
 *
 * @returns адаптивный компонент только со спинером, занимает всю ширину и высоту родителя
 */
const OutletLoading: FC = () => {
  return (
    <div className={style.outLetLoading}>
      <Spinner color="blue" size="md" textLoading />
    </div>
  );
};

export default OutletLoading;
