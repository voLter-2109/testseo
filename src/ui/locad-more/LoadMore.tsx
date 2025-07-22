import { FC } from 'react';

import Spinner from '../spinner/Spinner';

import style from './loadMore.module.scss';

type Props = {
  isLoading: boolean;
};

const LoadMore: FC<Props> = ({ isLoading }) => {
  return (
    <div className={style.loadmore}>
      {isLoading ? <Spinner size="sm" /> : 'LoadMore'}
    </div>
  );
};

export default LoadMore;
