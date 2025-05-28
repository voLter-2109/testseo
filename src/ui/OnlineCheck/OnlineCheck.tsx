import classNames from 'classnames';
import { FC } from 'react';

import style from './onlineCheck.module.scss';

type Props = {
  isOnline: boolean;
};

const OnlineCheck: FC<Props> = ({ isOnline }) => {
  return (
    <div
      className={classNames(style.onlineCheckWrapper, {
        [style.isOnline]: isOnline,
      })}
    />
  );
};

export default OnlineCheck;
