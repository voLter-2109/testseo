import { FC, memo, useMemo } from 'react';

import style from './Badge.module.scss';

interface BadgeProps {
  count: number;
  type: 'new' | 'muted';
  extraClass?: string;
}

const Badge: FC<BadgeProps> = ({ count, type, extraClass }) => {
  const computedClassName = useMemo(() => {
    return `${style.badge} ${
      type === 'new' ? style.badge_new : style.badge_muted
    } ${extraClass}`;
  }, [type, extraClass]);
  return <div className={computedClassName}>{count}</div>;
};

export default memo(Badge);
