import { FC } from 'react';
import classNames from 'classnames';

import style from './clock.module.scss';

const Clock: FC = () => {
  return (
    <div className={style.clock}>
      <div className={classNames(style.center)}> </div>
      <div className={classNames(style.hand, style.hour)}> </div>
      <div className={classNames(style.hand, style.minute)}> </div>
    </div>
  );
};

export default Clock;
